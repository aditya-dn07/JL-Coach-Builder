import NextImage, { type ImageProps } from 'next/image';
type Props = ImageProps & { caption?: string; decorative?: boolean; focalPoint?: { x: number; y: number } };
// No wrapper element: existing markup, classes and animations are preserved.
export function ContentImage({ caption, decorative, focalPoint, style, alt, ...props }: Props) {
  const remote = typeof props.src === 'string' && props.src.startsWith('https://cdn.sanity.io/');
  return <NextImage {...props} alt={decorative ? '' : alt} aria-description={caption || undefined}
    style={{ ...style, ...(remote && focalPoint ? { objectPosition: (focalPoint.x * 100) + '% ' + (focalPoint.y * 100) + '%' } : {}) }} />;
}
