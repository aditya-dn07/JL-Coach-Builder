import { getSiteContent } from '@/lib/sanity/site-content';
import { ContentImage as Image } from '../shared/content-image';
import type { ImageRef } from '@/data/site.schema';

export async function Photo({
  image,
  override,
  priority = false,
  sizes = '(max-width: 640px) 90vw, 35vw',
  className = '',
}: {
  image: ImageRef;
  override?: import('@/content/schema').ContentImage;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const { contentRepository } = await getSiteContent();
  const asset = contentRepository.getImageManifest()[image.id];
  const catalogUpload = image.optimizedSrc.startsWith('https://cdn.sanity.io/');
  const src = override?.src || (catalogUpload ? image.optimizedSrc : asset.variants?.at(-1)?.src ?? asset.src);
  const alt = override ? override.alt : catalogUpload ? image.alt : asset.alt;
  const point = override?.focalPoint ?? asset.focalPoint ?? image.focalPoint;
  const position = `${point.x * 100}% ${point.y * 100}%`;
  // The generated tiny preview provides a soft placeholder without runtime SVG filters.
  return (
    <div
      className={`photo ${className}`}
      style={{
        backgroundImage: asset.blurDataURL ? `url(${asset.blurDataURL})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: position,
      }}
    >
      <Image
        src={src} caption={override?.caption ?? asset.caption} decorative={override?.decorative ?? asset.decorative} focalPoint={point}
        alt={alt}
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
