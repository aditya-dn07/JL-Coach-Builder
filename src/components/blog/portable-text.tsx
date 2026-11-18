import { ContentImage as Image } from '../shared/content-image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { imageUrl, type CmsImage } from '../../lib/sanity/images';
type Block = { _type: string; _key?: string } & Record<string, unknown>;
const safeHref = (href: unknown): string => typeof href === 'string' && /^(https?:\/\/|\/(?!\/)|mailto:|tel:|#)/i.test(href) ? href : '#';
function Video({ value }: { value: { url?: string; title?: string; poster?: CmsImage & { caption?: string } } }) {
  let src = '';
  try {
    const url = new URL(value.url || '');
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.replace(/^www\./, '');
    const id = host === 'youtu.be' ? url.pathname.slice(1) : host === 'youtube.com' ? url.searchParams.get('v') || url.pathname.split('/').at(-1) : null;
    if (id && /^[a-zA-Z0-9_-]+$/.test(id)) src = 'https://www.youtube-nocookie.com/embed/' + id;
    if (host === 'vimeo.com' && /^\/\d+$/.test(url.pathname)) src = 'https://player.vimeo.com/video' + url.pathname;
  } catch { return null; }
  return src ? <figure>{value.poster && imageUrl(value.poster) && <Image src={imageUrl(value.poster)!} alt={value.poster.alt || ''} caption={value.poster.caption} decorative={value.poster.decorative} focalPoint={value.poster.hotspot} width={value.poster.width || 1200} height={value.poster.height || 800} sizes="100vw" />}<iframe className="aspect-video w-full" title={value.title || 'Video'} src={src} loading="lazy" allowFullScreen /><figcaption>{value.title}</figcaption></figure> : null;
}
const components: Partial<PortableTextComponents> = {
  marks: { link: ({ value, children }) => <a className="underline" href={safeHref(value?.href)} rel={typeof value?.href === 'string' && value.href.startsWith('http') ? 'noopener noreferrer' : undefined}>{children}</a> },
  types: {
    accessibleImage: ({ value }) => {
      const image = value as CmsImage & { caption?: string };
      const src = imageUrl(image); if (!src) return null;
      return <figure><Image src={src} alt={image.decorative ? '' : image.alt || ''} width={image.width || 1200} height={image.height || 800} sizes="(max-width: 900px) 100vw, 800px" />{image.caption && <figcaption>{image.caption}</figcaption>}</figure>;
    },
    blogVideo: ({ value }) => <Video value={value} />,
    blogTable: ({ value }) => <div className="overflow-x-auto"><table className="w-full text-left">{value.caption && <caption>{String(value.caption)}</caption>}<thead><tr>{(value.headers as string[] ?? []).map((text, index) => <th key={index} scope="col" className="border border-line p-3">{text}</th>)}</tr></thead><tbody>{(value.rows as { _key?: string; cells?: string[] }[] ?? []).map((row, index) => <tr key={row._key || index}>{(row.cells ?? []).map((text, cell) => <td className="border border-line p-3" key={cell}>{text}</td>)}</tr>)}</tbody></table></div>,
    blogCallout: ({ value }) => <aside className="rounded-lg border border-line p-6" data-tone={value.tone}>{value.tone && <span className="sr-only">{String(value.tone)}</span>}{value.title && <h3>{String(value.title)}</h3>}<RichText value={value.body ?? []} /></aside>,
    blogDivider: () => <hr className="my-10 border-line" />,
    blogCode: ({ value }) => <figure>{value.filename && <figcaption>{String(value.filename)}</figcaption>}<pre className="overflow-x-auto rounded-lg bg-black p-5"><code className={value.language ? 'language-' + String(value.language).replace(/[^a-zA-Z0-9-]/g, '') : undefined}>{String(value.code || '')}</code></pre></figure>,
  },
  unknownType: () => null,
};
export function RichText({ value }: { value: Block[] }) { return <PortableText value={value as Parameters<typeof PortableText>[0]['value']} components={components} />; }
