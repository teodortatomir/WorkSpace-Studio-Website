import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, writeFile, rm, stat } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import os from 'node:os';
import path from 'node:path';
import { projectRoot } from './lib/build.mjs';
import { createStaticServer, listen } from './lib/server.mjs';

const baseline = process.argv[2];
if (!baseline) throw new Error('Usage: npm run verify:browser -- /absolute/path/to/original-static-site');
await stat(path.join(baseline, 'index.html'));
await stat(path.join(projectRoot, 'dist/index.html'));

const chromePath = process.env.CHROME_PATH || (process.platform === 'darwin'
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  : 'google-chrome');
const routes = process.env.BROWSER_ROUTES?.split(',') || [
  'index.html', 'about/about.html', 'our-services/design-services.html',
  'projects-scene/proiecte.html', 'projects/Adobe/adobe.html',
  'ergonomics-specialists/articles/sit-stand-move-repeat.html',
  'insights/articles/aeron-chair-moma.html',
  'insights/press/workspace-studio-27-milioane-2024.html',
  'contact/contact.html', 'services/index.html',
  'sustainability/index.html', 'partners/partners.html',
];
const interactions = process.env.BROWSER_ROUTES ? [] : [
  ['menu', 'about/about.html', "document.getElementById('menuOpen').click()"],
  ['contact-validation', 'contact/contact.html', "document.getElementById('contactForm').requestSubmit()"],
  ['project-lightbox', 'projects/Adobe/adobe.html', "document.querySelector('.gallery-item').click()"],
];

function connectCDP(url) {
  const socket = new WebSocket(url);
  const pending = new Map();
  let nextId = 0;
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(JSON.stringify(message.error)));
    else request.resolve(message.result);
  });
  return {
    ready: once(socket, 'open'),
    close: () => socket.close(),
    call(method, params = {}, sessionId) {
      return new Promise((resolve, reject) => {
        const id = ++nextId;
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`Chrome command timed out: ${method}`));
        }, 20000);
        pending.set(id, {
          resolve: result => { clearTimeout(timer); resolve(result); },
          reject: error => { clearTimeout(timer); reject(error); },
        });
        socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
      });
    },
  };
}

async function launchChrome(profile) {
  const process = spawn(chromePath, [
    '--headless=new', '--disable-gpu', '--no-first-run',
    '--no-default-browser-check', '--disable-background-networking',
    '--disable-component-update', '--disable-sync',
    `--user-data-dir=${profile}`, '--remote-debugging-port=0', 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  try {
    const url = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Chrome startup timed out')), 15000);
      process.once('error', error => { clearTimeout(timer); reject(error); });
      process.once('exit', code => { clearTimeout(timer); reject(new Error(`Chrome exited: ${code}`)); });
      process.stderr.on('data', data => {
        const match = data.toString().match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (match) { clearTimeout(timer); resolve(match[1]); }
      });
    });
    return { process, url };
  } catch (error) { process.kill(); throw error; }
}

const originalServer = createStaticServer(baseline);
const refactoredServer = createStaticServer(path.join(projectRoot, 'dist'));
const profile = await mkdtemp(path.join(os.tmpdir(), 'workspace-browser-'));
const artifactDirectory = path.join(projectRoot, 'artifacts/browser');
let chrome;
let cdp;
try {
  const beforeURL = await listen(originalServer, 0);
  const afterURL = await listen(refactoredServer, 0);
  chrome = await launchChrome(profile);
  cdp = connectCDP(chrome.url);
  await cdp.ready;
  const { targetId } = await cdp.call('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.call('Target.attachToTarget', { targetId, flatten: true });
  const call = (method, params) => cdp.call(method, params, sessionId);
  async function evaluate(expression) {
    const result = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  }
  await call('Page.enable');
  await call('Runtime.enable');
  // These overrides are test-only. Both versions use the same settled visual
  // state; source files and the running development site are never modified.
  await call('Page.addScriptToEvaluateOnNewDocument', {
    source: `document.addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style');
      style.textContent = '*,*::before,*::after { animation-delay:0s !important; animation-duration:0s !important; transition-duration:0s !important; transition-delay:0s !important; caret-color:transparent !important; }';
      document.head.append(style);
      document.querySelectorAll('video').forEach(video => {
        video.pause();
        video.addEventListener('play', () => video.pause());
      });
    });`,
  });
  await mkdir(artifactDirectory, { recursive: true });

  async function snapshot(baseURL, route, viewport, label, action) {
    await call('Page.navigate', { url: `${baseURL}/${route}` });
    let loaded = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      await delay(50);
      if (await evaluate('document.readyState === "complete"')) { loaded = true; break; }
    }
    if (!loaded) throw new Error(`Page did not finish loading: ${route}`);
    await evaluate('Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 5000))]).then(() => true)');
    await delay(1700);
    await evaluate(`Promise.all([...document.querySelectorAll('video')].map(video => new Promise(resolve => {
      video.pause();
      if (video.readyState < 1) { resolve(); return; }
      video.addEventListener('seeked', () => requestAnimationFrame(() => requestAnimationFrame(resolve)), { once:true });
      video.currentTime = 0;
      setTimeout(resolve, 2000);
    }))).then(() => true)`);
    await evaluate('Promise.all([...document.images].filter(image => image.complete).map(image => image.decode().catch(() => {}))).then(() => true)');
    if (action) {
      await evaluate(action);
      // Form validation focuses its first field and triggers native smooth
      // scrolling. Wait for that scroll, which CSS transition overrides do not stop.
      await delay(900);
    }
    await delay(150);
    const state = await evaluate(`({
      title: document.title,
      headings: [...document.querySelectorAll('h1,h2')].map(element => element.textContent.trim()),
      menu: document.getElementById('menuOverlay')?.className,
      overflow: document.body.style.overflow,
      projects: document.querySelectorAll('.project-card-visual,.project-card,.project-slider-card').length,
      articleLength: document.getElementById('articleRoot')?.textContent.trim().length,
      formStatus: document.getElementById('formStatus')?.textContent.trim(),
      lightbox: document.getElementById('adobeLightbox')?.className,
    })`);
    const screenshot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const bytes = Buffer.from(screenshot.data, 'base64');
    const file = `${route.replaceAll('/', '--')}--${viewport}--${label}.png`;
    await writeFile(path.join(artifactDirectory, file), bytes);
    return { state, sha256: createHash('sha256').update(bytes).digest('hex'), file };
  }

  const results = [];
  async function compare(route, viewport, action, interaction) {
    const before = await snapshot(beforeURL, route, viewport, 'before', action);
    const after = await snapshot(afterURL, route, viewport, 'after', action);
    const result = {
      route, viewport, ...(interaction ? { interaction } : {}),
      statesEqual: JSON.stringify(before.state) === JSON.stringify(after.state),
      pixelsEqual: before.sha256 === after.sha256, before, after,
    };
    results.push(result);
    console.log(`${viewport} ${route}: DOM ${result.statesEqual ? 'equal' : 'DIFFERENT'}, PNG ${result.pixelsEqual ? 'equal' : 'DIFFERENT'}`);
  }
  for (const [viewport, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: viewport === 'mobile' });
    for (const route of routes) await compare(route, viewport);
  }
  await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  for (const [name, route, action] of interactions) await compare(route, `interaction-${name}`, action, name);
  await writeFile(path.join(artifactDirectory, 'report.json'), JSON.stringify(results, null, 2) + '\n');
  const mismatches = results.filter(result => !result.statesEqual || !result.pixelsEqual);
  console.log(`${results.length} comparisons, ${mismatches.length} differences. Report: artifacts/browser/report.json`);
  if (mismatches.length) process.exitCode = 1;
} finally {
  if (cdp) { await cdp.call('Browser.close').catch(() => {}); cdp.close(); }
  chrome?.process.kill();
  originalServer.closeAllConnections();
  refactoredServer.closeAllConnections();
  originalServer.close();
  refactoredServer.close();
  await delay(500);
  await rm(profile, { recursive: true, force: true }).catch(() => {});
}
