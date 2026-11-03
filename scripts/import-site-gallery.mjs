import { readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const html = await readFile('docs/source-gallery.html', 'utf8');
const urls = [...new Set(html.match(/https:\/\/jlcoachbuilders\.co\.nz\/storage\/[^\s"<>]+\.(?:jpg|jpeg|png|webp)/gi))]
  .filter(url => !/-\d+x\d+\.|LOGO|banner|\.jpg\.webp/i.test(url));
await mkdir('public/images/gallery', { recursive: true });
const photos = new Array(urls.length);
let cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < urls.length) {
    const index = cursor++;
    const source = urls[index];
    const response = await fetch(source, { signal: AbortSignal.timeout(45000) });
    if (!response.ok) throw new Error(`${response.status}: ${source}`);
    const file = `/images/gallery/project-${String(index + 1).padStart(3, '0')}.webp`;
    const { width, height } = await sharp(Buffer.from(await response.arrayBuffer()))
      .rotate().resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 }).toFile(`public${file}`);
    photos[index] = { src: file, width, height, source, alt: `JL Coachbuilders project photograph ${index + 1}` };
  }
}));
await writeFile('src/data/site-gallery.json', JSON.stringify(photos, null, 2));
console.log(`Imported ${photos.length} original website gallery photographs.`);
