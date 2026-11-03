# Image processing report

Six photographs downloaded from the existing site; logo supplied by the client as a 2170×725 transparent PNG. Originals are preserved unchanged. The logo is trimmed to its visible artwork (2085×272) and exported losslessly with transparency. Photo crops use each ImageRef focal point; no enlargement. Mild brightness (1.02), contrast (1.025) and sharpening apply to photos only. Photos retain their natural colours; modest corner radii are applied in CSS. Decorative overlays and stripes have been removed.

| Image / use | Original pixels / bytes | Crop | Export pixels / WebP bytes / AVIF bytes |
|---|---|---|---|
| logo | 2170×725 / 298012 | 2085×272 at 0,0 after transparent-margin trim | 340×44 / 8344 / 19040 |
| logo | 2170×725 / 298012 | 2085×272 at 0,0 after transparent-margin trim | 480×63 / 15364 / 22894 |
| logo | 2170×725 / 298012 | 2085×272 at 0,0 after transparent-margin trim | 768×100 / 27158 / 39767 |
| logo | 2170×725 / 298012 | 2085×272 at 0,0 after transparent-margin trim | 1024×134 / 40792 / 58990 |
| logo | 2170×725 / 298012 | 2085×272 at 0,0 after transparent-margin trim | 1440×188 / 73106 / 95276 |
| workshop | 1920×2560 / 1071240 | 1920×2400 at 0,0 | 340×425 / 31672 / 24331 |
| workshop | 1920×2560 / 1071240 | 1920×2400 at 0,0 | 480×600 / 60210 / 43719 |
| workshop | 1920×2560 / 1071240 | 1920×2400 at 0,0 | 768×960 / 150058 / 108129 |
| workshop | 1920×2560 / 1071240 | 1920×2400 at 0,0 | 1024×1280 / 256224 / 181878 |
| workshop | 1920×2560 / 1071240 | 1920×2400 at 0,0 | 1440×1800 / 464848 / 316553 |
| caravan | 1024×768 / 207277 | 1024×768 at 0,0 | 340×255 / 10548 / 7237 |
| caravan | 1024×768 / 207277 | 1024×768 at 0,0 | 480×360 / 17490 / 11521 |
| caravan | 1024×768 / 207277 | 1024×768 at 0,0 | 768×576 / 36644 / 22970 |
| caravan | 1024×768 / 207277 | 1024×768 at 0,0 | 1024×768 / 58812 / 35928 |
| campervan | 768×1024 / 218750 | 768×576 at 0,173 | 340×255 / 15640 / 11412 |
| campervan | 768×1024 / 218750 | 768×576 at 0,173 | 480×360 / 29178 / 20358 |
| campervan | 768×1024 / 218750 | 768×576 at 0,173 | 768×576 / 63294 / 42904 |
| motorhome | 768×1024 / 167210 | 768×1024 at 0,0 | 340×453 / 22094 / 14072 |
| motorhome | 768×1024 / 167210 | 768×1024 at 0,0 | 480×640 / 39566 / 24330 |
| motorhome | 768×1024 / 167210 | 768×1024 at 0,0 | 768×1024 / 82476 / 53335 |
| fifth-wheel | 768×1024 / 232565 | 768×576 at 0,173 | 340×255 / 18322 / 13120 |
| fifth-wheel | 768×1024 / 232565 | 768×576 at 0,173 | 480×360 / 32944 / 22795 |
| fifth-wheel | 768×1024 / 232565 | 768×576 at 0,173 | 768×576 / 70346 / 48644 |
| bus | 768×1024 / 243126 | 768×576 at 0,173 | 340×255 / 16250 / 11552 |
| bus | 768×1024 / 243126 | 768×576 at 0,173 | 480×360 / 30074 / 20308 |
| bus | 768×1024 / 243126 | 768×576 at 0,173 | 768×576 / 67132 / 46032 |

## Placement and reshoot recommendations

- Logo: client-supplied transparent PNG, trimmed for legible header/footer placement; light footer background keeps its black tagline readable. The old 340px JPEG is retained as historical source only.
- Workshop: 4:5 hero and editorial What We Do image; priority loading only for hero. Crop removes surplus driveway while retaining caravan and workshop.
- Caravan: 4:3 source crop in the responsive service showcase; the largest available optimized variant is used.
- Motorhome interior: 3:4 source crop reframed within the service showcase preview using its focal point.
- Campervan, fifth wheel and bus: 4:3 source crops in the responsive service showcase; previews remain within the bounded feature panel.
- The four 768px-wide originals are too small for full-bleed or crisp large high-density displays. Request new high-resolution photographs of campervan, motorhome interior, fifth wheel and bus.
- Existing image source and corrected descriptive alt text are recorded in site.data.ts. Generated manifests provide actual output dimensions and blur placeholders.
