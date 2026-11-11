import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { optimizeJpeg } from '../scripts/lib/optimize-images.mjs';

test('publication JPEGs retain format, respect dimensions and do not modify originals', async () => {
  const source = await sharp({ create: { width: 3000, height: 2000, channels: 3, background: '#ac6543' } })
    .jpeg({ quality: 100 }).toBuffer();
  const copy = Buffer.from(source);
  const result = await optimizeJpeg(source);
  const metadata = await sharp(result).metadata();
  assert.equal(metadata.format, 'jpeg');
  assert.equal(metadata.width, 1440);
  assert.equal(metadata.height, 960);
  assert.ok(result.length < source.length);
  assert.deepEqual(source, copy);
});

test('small JPEGs are not enlarged or increased in file size', async () => {
  const source = await sharp({ create: { width: 120, height: 80, channels: 3, background: 'white' } })
    .jpeg({ quality: 50 }).toBuffer();
  const result = await optimizeJpeg(source);
  const metadata = await sharp(result).metadata();
  assert.equal(metadata.width, 120);
  assert.equal(metadata.height, 80);
  assert.ok(result.length <= source.length);
});
