import { getSanityIdentifiers } from './config';
import imageUrlBuilder from '@sanity/image-url';
export type CmsImage = {
  asset?: { _ref?: string }; alt?: string; decorative?: boolean;
  src?: string; caption?: string; width?: number; height?: number;
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; width: number; height: number };
};
export function imageUrl(image: CmsImage): string | undefined {
  const { projectId, dataset } = getSanityIdentifiers();
  if (!projectId || !image.asset?._ref) return image.src;
  try {
    const match = image.asset._ref.match(/-(\d+)x(\d+)-/);
    const width = image.width || Number(match?.[1]) || 1200;
    const height = image.height || Number(match?.[2]) || 800;
    return imageUrlBuilder({ projectId, dataset }).image(image).width(width).height(height).fit('crop').auto('format').url();
  } catch { return image.src; }
}
export function resolveImages(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(resolveImages);
  if (!value || typeof value !== 'object') return value;
  const result = Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, resolveImages(entry)]));
  const image = result as CmsImage;
  if (image.decorative) result.alt = '';
  if (image.asset?._ref) {
    const src = imageUrl(image);
    if (src) {
      const match = image.asset._ref.match(/-(\d+)x(\d+)-/);
      result.src = src; result.optimizedSrc = src;
      const { projectId, dataset } = getSanityIdentifiers();
      result.originalSrc = projectId ? imageUrlBuilder({ projectId, dataset }).image({ asset: image.asset }).url() : src;
      result.width = image.width || Number(match?.[1]) || 1200;
      result.height = image.height || Number(match?.[2]) || 800;
      result.alt = image.decorative ? '' : image.alt ?? '';
      if (image.hotspot) result.focalPoint = { x: image.hotspot.x, y: image.hotspot.y };
      delete result.variants; delete result.blurDataURL;
    }
  }
  return result;
}
