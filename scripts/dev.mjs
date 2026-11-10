import { watch } from 'node:fs';
import path from 'node:path';
import { buildSite, projectRoot } from './lib/build.mjs';
import { createStaticServer, listen } from './lib/server.mjs';

await buildSite();
const server = createStaticServer(path.join(projectRoot, 'dist'));
console.log(`Development: ${await listen(server, Number(process.env.PORT || 3000))}`);
console.log('Watching src/, public/, and config/build.json. Refresh the browser after a rebuild.');
let timer;
let building = false;
let pending = false;
async function rebuild() {
  if (building) { pending = true; return; }
  building = true;
  try { const result = await buildSite(); console.log(`Rebuilt ${result.total} files.`); }
  catch (error) { console.error(error.message); }
  finally {
    building = false;
    if (pending) { pending = false; await rebuild(); }
  }
}
const watchers = ['src', 'public', 'config/build.json'].map(relative =>
  watch(path.join(projectRoot, relative), { recursive: relative !== 'config/build.json' }, () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 120);
  })
);
function stop() {
  clearTimeout(timer);
  watchers.forEach(watcher => watcher.close());
  server.close();
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
