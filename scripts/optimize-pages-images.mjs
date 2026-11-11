import { readFile, writeFile, rename, stat, cp, rm } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { listFiles, projectRoot } from './lib/build.mjs';
import { optimizeJpeg } from './lib/optimize-images.mjs';

// Isolate publication output from a running development server rebuilding dist/.
const output = path.join(projectRoot, '.pages-build');
await rm(output, { recursive: true, force: true });
await cp(path.join(projectRoot, 'dist'), output, { recursive: true, mode: constants.COPYFILE_FICLONE });
const files = await listFiles(output);
const photos = files.filter(file => /\.jpe?g$/i.test(file));
let cursor = 0;
let before = 0;
let after = 0;
let completed = 0;
let skipped = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < photos.length) {
    const file = photos[cursor++];
    const source = path.join(projectRoot, 'public', path.relative(output, file));
    const original = await readFile(source);
    let optimized;
    try { optimized = await optimizeJpeg(original); }
    catch (error) {
      // Keep any pre-existing malformed JPEG byte-for-byte, rather than losing an asset.
      optimized = original;
      skipped++;
      console.warn(`Kept original ${path.relative(output, file)}: ${error.message.split('\n')[0]}`);
    }
    before += original.length;
    after += optimized.length;
    if (optimized !== original) {
      const temporary = file + '.optimizing';
      await writeFile(temporary, optimized);
      await rename(temporary, file);
    }
    completed++;
    if (completed % 500 === 0) console.log(`Optimized ${completed}/${photos.length} photographs`);
  }
}));
let total = 0;
for (const file of files) total += (await stat(file)).size;
const mib = bytes => (bytes / 1024 ** 2).toFixed(1);
console.log(`JPEGs: ${mib(before)} → ${mib(after)} MiB (${photos.length} files).`);
console.log(`Complete site: ${mib(total)} MiB. Originals in public/ are unchanged.`);
if (skipped) console.warn(`${skipped} JPEGs could not be recompressed and were kept unchanged.`);
// Leave room below GitHub Pages' 1 GB limit and stop before uploading oversized builds.
if (total > 950_000_000) throw new Error('Site exceeds the 950 MB publication budget. Reduce assets before deploying.');
