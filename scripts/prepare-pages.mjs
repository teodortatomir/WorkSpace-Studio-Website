import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { listFiles, projectRoot } from './lib/build.mjs';
import { adaptHomepageLinks } from './lib/pages.mjs';

const directory = process.argv[2] || 'dist';
if (!['dist', '.pages-build'].includes(directory)) throw new Error('Unsupported publication directory');
const output = path.join(projectRoot, directory);
let count = 0;
for (const file of await listFiles(output)) {
  if (path.extname(file) !== '.html') continue;
  const original = await readFile(file, 'utf8');
  const adapted = adaptHomepageLinks(original, path.relative(output, file).split(path.sep).join('/'));
  if (adapted !== original) { await writeFile(file, adapted); count++; }
}
console.log(`GitHub Pages: adapted homepage logo links in ${count} HTML files for subdirectory hosting.`);
