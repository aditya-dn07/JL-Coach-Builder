import sharp from 'sharp';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

// Read the same content document without executing TypeScript.
const data = JSON.parse(await readFile('src/data/legacy-content.json', 'utf8'));
const images = [data.logo, data.hero.image, ...data.services.map((s) => s.image)];
await mkdir('public/images/optimized', { recursive: true });
const manifest = {};
let report =
  '# Image processing report\n\nSix photographs downloaded from the existing site; logo supplied by the client as a 2170×725 transparent PNG. Originals are preserved unchanged. The logo is trimmed to its visible artwork (2085×272) and exported losslessly with transparency. Photo crops use each ImageRef focal point; no enlargement. Mild brightness (1.02), contrast (1.025) and sharpening apply to photos only. Photos retain their natural colours; modest corner radii are applied in CSS. Decorative overlays and stripes have been removed.\n\n| Image / use | Original pixels / bytes | Crop | Export pixels / WebP bytes / AVIF bytes |\n|---|---|---|---|\n';
for (const image of images) {
  const input = path.join('public/images/original', path.basename(image.originalSrc));
  const originalMeta = await sharp(input).metadata();
  const artwork = image.id === 'logo' ? await sharp(input).trim().toBuffer() : input;
  const meta = await sharp(artwork).metadata();
  const ratio =
    image.id === 'logo'
      ? meta.width / meta.height
      : image.id === 'workshop'
        ? 4 / 5
        : image.id === 'motorhome'
          ? 3 / 4
          : 4 / 3;
  let cropWidth = meta.width,
    cropHeight = Math.round(cropWidth / ratio);
  if (cropHeight > meta.height) {
    cropHeight = meta.height;
    cropWidth = Math.round(cropHeight * ratio);
  }
  const left = Math.max(
    0,
    Math.min(meta.width - cropWidth, Math.round(meta.width * image.focalPoint.x - cropWidth / 2))
  );
  const top = Math.max(
    0,
    Math.min(
      meta.height - cropHeight,
      Math.round(meta.height * image.focalPoint.y - cropHeight / 2)
    )
  );
  const pipeline = () =>
    sharp(artwork).rotate().extract({ left, top, width: cropWidth, height: cropHeight });
  const widths = [
    ...new Set(
      [340, 480, 768, 1024, 1440].filter((w) => w <= cropWidth).concat(Math.min(768, cropWidth))
    ),
  ].sort((a, b) => a - b);
  const variants = [];
  for (const width of widths) {
    const base = pipeline().resize({ width, withoutEnlargement: true });
    if (image.id !== 'logo')
      base.modulate({ brightness: 1.02 }).linear(1.025, -3).sharpen({ sigma: 0.45 });
    const name = `/images/optimized/${image.id}-${width}`;
    await base
      .clone()
      .webp(image.id === 'logo' ? { lossless: true } : { quality: 80 })
      .toFile('public' + name + '.webp');
    await base
      .clone()
      .avif(image.id === 'logo' ? { lossless: true } : { quality: 52 })
      .toFile('public' + name + '.avif');
    const webpBytes = (await stat('public' + name + '.webp')).size;
    const avifBytes = (await stat('public' + name + '.avif')).size;
    variants.push({ width, src: name + '.webp', avif: name + '.avif', webpBytes, avifBytes });
    report += `| ${image.id} | ${originalMeta.width}×${originalMeta.height} / ${(await stat(input)).size} | ${cropWidth}×${cropHeight} at ${left},${top}${image.id === 'logo' ? ' after transparent-margin trim' : ''} | ${width}×${Math.round(width / ratio)} / ${webpBytes} / ${avifBytes} |\n`;
  }
  const selected = variants.find((v) => v.width === 768) ?? variants.at(-1);
  const blur = await pipeline().resize(16).webp({ quality: 30 }).toBuffer();
  manifest[image.id] = {
    src: selected.src,
    width: selected.width,
    height: Math.round(selected.width / ratio),
    blurDataURL: 'data:image/webp;base64,' + blur.toString('base64'),
    variants,
  };
}
await writeFile('src/data/image-manifest.json', JSON.stringify(manifest, null, 2));
await sharp('public/images/original/20211022_140143-1-scaled-1.jpg')
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 85 })
  .toFile('public/images/optimized/og.jpg');
report +=
  '\n## Placement and reshoot recommendations\n\n- Logo: client-supplied transparent PNG, trimmed for legible header/footer placement; light footer background keeps its black tagline readable. The old 340px JPEG is retained as historical source only.\n- Workshop: 4:5 hero and editorial What We Do image; priority loading only for hero. Crop removes surplus driveway while retaining caravan and workshop.\n- Caravan: 4:3 source crop in the responsive service showcase; the largest available optimized variant is used.\n- Motorhome interior: 3:4 source crop reframed within the service showcase preview using its focal point.\n- Campervan, fifth wheel and bus: 4:3 source crops in the responsive service showcase; previews remain within the bounded feature panel.\n- The four 768px-wide originals are too small for full-bleed or crisp large high-density displays. Request new high-resolution photographs of campervan, motorhome interior, fifth wheel and bus.\n- Existing image source and corrected descriptive alt text are recorded in site.data.ts. Generated manifests provide actual output dimensions and blur placeholders.\n';
await writeFile('docs/image-report.md', report);
console.log(
  `Processed ${images.length} images; wrote responsive variants, blur manifest and image report.`
);
