/* eslint-disable @next/next/no-img-element -- ImageResponse renders image data directly during asset generation. */
import React from 'react';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import { ImageResponse } from 'next/og';
import config from '../src/config/site.json';

async function generate() {
  await fs.mkdir('public/images/brand', { recursive: true });
  await fs.mkdir('public/icons', { recursive: true });
  const displayFont = await fs.readFile('public/fonts/outfit-medium.ttf');
  const photo = await sharp('public/images/original/20211022_140143-1-scaled-1.jpg')
    .resize(540, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 88 })
    .toBuffer();
  const logo = await sharp('public/images/optimized/logo-768.webp').png().toBuffer();
  const response = new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: '#f6f5f0',
        fontFamily: 'Outfit',
        color: '#222421',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', width: 660, padding: '48px 52px' }}>
        <img
          src={`data:image/png;base64,${logo.toString('base64')}`}
          width={330}
          height={43}
          alt=""
        />
        <div
          style={{
            display: 'flex',
            fontSize: 15,
            letterSpacing: 3,
            marginTop: 55,
            color: '#60655d',
          }}
        >
          CHRISTCHURCH · NEW ZEALAND
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 62,
            lineHeight: 1.08,
            letterSpacing: -2,
            marginTop: 25,
          }}
        >
          <div>Specialist repairs.</div>
          <div>More adventures.</div>
        </div>
        <div style={{ display: 'flex', fontSize: 23, marginTop: 27, color: '#60655d' }}>
          Caravans · Motorhomes · Campervans
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 'auto',
            borderTop: '1px solid #d5d9ce',
            paddingTop: 22,
            fontSize: 19,
            color: '#b72322',
          }}
        >
          80+ years of combined experience
        </div>
      </div>
      <img
        src={`data:image/jpeg;base64,${photo.toString('base64')}`}
        width={540}
        height={630}
        style={{ objectFit: 'cover' }}
        alt=""
      />
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Outfit', data: displayFont, weight: 500, style: 'normal' }],
    }
  );
  await sharp(Buffer.from(await response.arrayBuffer()))
    .jpeg({ quality: 90 })
    .toFile('public/images/brand/og.jpg');
  const iconSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="72" fill="#252925"/><path d="M103 331h48c26 0 39-13 39-40V117h58v177c0 64-33 97-95 97h-50zM288 117h59v216h91v58H288z" fill="#f6f5f0"/><path d="M102 421h336v18H102z" fill="#d72d2b"/></svg>`
  );
  await fs.writeFile('public/icon.svg', iconSvg);
  for (const size of [16, 32, 48, 180, 192, 512]) {
    await sharp(iconSvg)
      .resize(size, size)
      .png()
      .toFile(size === 180 ? 'public/apple-touch-icon.png' : `public/icons/icon-${size}.png`);
  }
  const iconBuffers = await Promise.all(
    [16, 32, 48].map((size) => fs.readFile(`public/icons/icon-${size}.png`))
  );
  const header = Buffer.alloc(6 + 16 * iconBuffers.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(iconBuffers.length, 4);
  let offset = header.length;
  iconBuffers.forEach((buffer, i) => {
    const size = [16, 32, 48][i];
    const entry = 6 + i * 16;
    header[entry] = size;
    header[entry + 1] = size;
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(buffer.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += buffer.length;
  });
  await fs.writeFile('public/favicon.ico', Buffer.concat([header, ...iconBuffers]));
  await fs.writeFile(
    'public/site.webmanifest',
    JSON.stringify(
      {
        name: config.business.name,
        short_name: 'JL Coachbuilders',
        description: config.seo.description,
        start_url: '/',
        display: 'standalone',
        background_color: '#f6f5f0',
        theme_color: config.themeColor,
        lang: config.language,
        icons: [192, 512].map((size) => ({
          src: `/icons/icon-${size}.png`,
          sizes: `${size}x${size}`,
          type: 'image/png',
          purpose: 'any',
        })),
      },
      null,
      2
    ) + '\n'
  );
  console.log(
    'Generated 1200×630 OG artwork, favicon.ico, SVG, Apple touch icon, PNG icons and web manifest.'
  );
}
generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
