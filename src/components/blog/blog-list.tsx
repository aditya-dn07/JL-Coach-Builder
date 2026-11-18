import { ContentImage as Image } from '../shared/content-image';
import Link from 'next/link';
import { getSiteContent } from '../../lib/sanity/site-content';
import type { BlogPost } from '../../lib/sanity/blog';
export function ArticleCards({ posts, readMore }: { posts: BlogPost[]; readMore: string }) {
  return <div className="vehicle-grid classic-service-grid">{posts.map(post => <article className="vehicle-card" key={post._id}>
    {post.featuredImage?.src && <Link className="vehicle-photo" href={'/blog/' + post.slug.current + '/'}><Image src={post.featuredImage.src} caption={post.featuredImage.caption} decorative={post.featuredImage.decorative} focalPoint={post.featuredImage.focalPoint} alt={post.featuredImage.alt} width={post.featuredImage.width} height={post.featuredImage.height} sizes="(max-width: 650px) 100vw, 33vw" /></Link>}
    <div className="vehicle-card-copy"><h3><Link href={'/blog/' + post.slug.current + '/'}>{post.title}</Link></h3><p>{post.excerpt}</p><Link className="underlink" href={'/blog/' + post.slug.current + '/'}>{readMore}</Link></div>
  </article>)}</div>;
}
export async function BlogCta({ value }: { value: { enabled: boolean; eyebrow: string; title: string; description: string; quoteLabel: string; callLabel: string; quoteHref?: string; callHref?: string; image: import('../../content/schema').ContentImage } }) {
  if (!value.enabled) return null;
  const { phoneHref, siteConfig } = await getSiteContent();
  return <section className="container section-pad contact-cta"><div className="contact-panel">
    {value.image.src && <div className="contact-panel-background"><Image src={value.image.src} caption={value.image.caption} decorative={value.image.decorative} focalPoint={value.image.focalPoint} alt={value.image.alt} fill sizes="100vw" /></div>}
    <div className="contact-panel-copy"><p className="kicker">{value.eyebrow}</p><h2>{value.title}</h2><p>{value.description}</p></div>
    <div className="contact-panel-actions"><a className="button primary" href={value.quoteHref || siteConfig.ui.quoteTarget}>{value.quoteLabel}</a><a className="button" href={value.callHref || phoneHref}>{value.callLabel}</a></div>
  </div></section>;
}
