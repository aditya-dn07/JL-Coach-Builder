import Image from 'next/image';
import type { ImageRef } from '@/data/site.schema';
import manifest from '@/data/image-manifest.json';

export function Photo({
  image,
  priority = false,
  sizes = '(max-width: 640px) 90vw, 35vw',
  className = '',
}: {
  image: ImageRef;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const asset = manifest[image.id as keyof typeof manifest];
  const src = asset.variants.at(-1)?.src ?? asset.src;
  const position = `${image.focalPoint.x * 100}% ${image.focalPoint.y * 100}%`;
  // The generated tiny preview provides a soft placeholder without runtime SVG filters.
  return (
    <div
      className={`photo ${className}`}
      style={{
        backgroundImage: `url(${asset.blurDataURL})`,
        backgroundSize: 'cover',
        backgroundPosition: position,
      }}
    >
      <Image
        src={src}
        alt={image.alt}
        fill
        priority={priority}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? 'sync' : 'async'}
        quality={priority ? 65 : 75}
        sizes={sizes}
        style={{ objectPosition: position }}
      />
    </div>
  );
}
