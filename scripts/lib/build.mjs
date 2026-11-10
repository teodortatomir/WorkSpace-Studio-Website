import { constants } from 'node:fs';
import { readFile, readdir, mkdir, rm, copyFile, open, mkdtemp, rename } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
const includePattern = /<!--@include ([^\r\n]+?) -->/g;
const valuePattern = /\{\{([A-Za-z][A-Za-z0-9]*)\}\}/g;

export function resolveInside(directory, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative)) {
    throw new Error(`Expected a relative path, received: ${relative}`);
  }
  const resolved = path.resolve(directory, relative);
  if (!resolved.startsWith(path.resolve(directory) + path.sep)) {
    throw new Error(`Path escapes its directory: ${relative}`);
  }
  return resolved;
}

export async function listFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlinks are not supported: ${fullPath}`);
    if (entry.isDirectory()) result.push(...await listFiles(fullPath));
    else if (entry.isFile()) result.push(fullPath);
  }
  return result.sort();
}

// This is text composition, deliberately without HTML parsing, formatting,
// minification, CSS processing, or JavaScript scope/timing changes.
export function createRenderer(sourceRoot) {
  const cache = new Map();
  async function render(relative, values = {}, ancestors = []) {
    const file = resolveInside(sourceRoot, relative);
    if (ancestors.includes(file)) {
      throw new Error(`Circular include: ${[...ancestors, file].join(' -> ')}`);
    }
    if (!cache.has(file)) cache.set(file, await readFile(file, 'utf8'));
    const source = cache.get(file).replace(valuePattern, (_, name) => {
      if (!Object.hasOwn(values, name) || typeof values[name] !== 'string') {
        throw new Error(`Missing string parameter "${name}" in ${relative}`);
      }
      return values[name];
    });
    const parts = [];
    let offset = 0;
    // matchAll gives each recursive invocation its own iterator.
    for (const match of source.matchAll(includePattern)) {
      let directive;
      try { directive = JSON.parse(match[1]); }
      catch (error) { throw new Error(`Invalid include JSON in ${relative}: ${error.message}`); }
      if (directive.values !== undefined && (
        directive.values === null || typeof directive.values !== 'object' || Array.isArray(directive.values)
      )) throw new Error(`Invalid include parameters in ${relative}`);
      parts.push(source.slice(offset, match.index));
      parts.push(await render(directive.file, { ...values, ...directive.values }, [...ancestors, file]));
      offset = match.index + match[0].length;
    }
    parts.push(source.slice(offset));
    const output = parts.join('');
    if (output.includes('<!--@include')) throw new Error(`Unresolved include in ${relative}`);
    return output;
  }
  return render;
}

async function acquireBuildLock(root) {
  const directory = path.join(root, '.cache');
  await mkdir(directory, { recursive: true });
  const file = path.join(directory, 'build.lock');
  const started = Date.now();
  while (true) {
    try {
      const handle = await open(file, 'wx');
      await handle.writeFile(String(process.pid));
      return async () => { await handle.close(); await rm(file, { force: true }); };
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      // Recover a lock left by a terminated development/build process.
      const owner = Number(await readFile(file, 'utf8').catch(() => ''));
      if (Number.isSafeInteger(owner) && owner > 0) {
        try { process.kill(owner, 0); }
        catch (check) {
          if (check.code === 'ESRCH') { await rm(file, { force: true }); continue; }
        }
      }
      if (Date.now() - started > 30000) throw new Error('Another build is still running; try again when it finishes.');
      await delay(80);
    }
  }
}

export async function buildSite({ root = projectRoot } = {}) {
  const release = await acquireBuildLock(root);
  try { return await buildUnlocked(root); }
  finally { await release(); }
}

async function buildUnlocked(root) {
  const config = JSON.parse(await readFile(path.join(root, 'config/build.json'), 'utf8'));
  const output = resolveInside(root, config.output);
  // Never let a config typo delete source or asset directories.
  if (path.relative(root, output) !== 'dist') throw new Error('Build output must be dist');
  const sourceRoot = path.join(root, 'src');
  const render = createRenderer(sourceRoot);
  const entries = new Map();
  function reserve(relative, input) {
    resolveInside(output, relative);
    if (entries.has(relative)) throw new Error(`Duplicate output URL: ${relative}`);
    entries.set(relative, input);
  }
  const publicRoot = resolveInside(root, config.public);
  for (const file of await listFiles(publicRoot)) reserve(path.relative(publicRoot, file), { asset: file });
  for (const source of config.sources) {
    const directory = resolveInside(root, source.directory);
    for (const file of await listFiles(directory)) {
      if (!source.extensions.includes(path.extname(file))) continue;
      reserve(path.relative(directory, file), { source: path.relative(sourceRoot, file) });
    }
  }
  // Render before touching dist: a broken include must not erase a working build.
  for (const entry of entries.values()) {
    if (entry.source) entry.text = await render(entry.source);
  }
  const staging = await mkdtemp(path.join(root, '.dist-build-'));
  const previous = staging + '-previous';
  const { writeFile } = await import('node:fs/promises');
  let codeFiles = 0;
  try {
    for (const [relative, entry] of entries) {
      const destination = resolveInside(staging, relative);
      await mkdir(path.dirname(destination), { recursive: true });
      if (entry.asset) await copyFile(entry.asset, destination, constants.COPYFILE_FICLONE);
      else { await writeFile(destination, entry.text); codeFiles++; }
    }
    let movedPrevious = false;
    try { await rename(output, previous); movedPrevious = true; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    try { await rename(staging, output); }
    catch (error) {
      if (movedPrevious) await rename(previous, output);
      throw error;
    }
    await rm(previous, { recursive: true, force: true });
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
  return { output, codeFiles, assets: entries.size - codeFiles, total: entries.size };
}
