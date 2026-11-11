import sharp from 'sharp';

// Keep URLs and file formats intact; only publish a smaller file when it helps.
export async function optimizeJpeg(input) {
  const output = await sharp(input, { failOn: 'error' })
    .rotate()
    .resize({ width: 1440, height: 1440, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 72, progressive: true })
    .toBuffer();
  return output.length < input.length ? output : input;
}
