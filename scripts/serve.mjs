import path from 'node:path';
import { stat } from 'node:fs/promises';
import { projectRoot } from './lib/build.mjs';
import { createStaticServer, listen } from './lib/server.mjs';

await stat(path.join(projectRoot, 'dist/index.html')).catch(() => {
  throw new Error('Run npm run build before npm run preview.');
});
const server = createStaticServer(path.join(projectRoot, 'dist'));
console.log(`Preview: ${await listen(server, Number(process.env.PORT || 4173))}`);
