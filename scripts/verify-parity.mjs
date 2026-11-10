import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { listFiles, projectRoot } from './lib/build.mjs';

const baseline = JSON.parse(await readFile(path.join(projectRoot, 'tests/fixtures/original-site.sha256.json'), 'utf8'));
const output = path.join(projectRoot, 'dist');
const actual = new Set((await listFiles(output)).map(file => path.relative(output, file).split(path.sep).join('/')));
const differences = [];
for (const [relative, expected] of Object.entries(baseline)) {
  if (!actual.delete(relative)) { differences.push(`Missing: ${relative}`); continue; }
  const bytes = await readFile(path.join(output, relative));
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (hash !== expected) differences.push(`Changed: ${relative}`);
}
for (const relative of actual) differences.push(`Added: ${relative}`);
if (differences.length) {
  console.error(differences.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Exact parity: all ${Object.keys(baseline).length} URLs and file contents match the original site (SHA-256).`);
}
