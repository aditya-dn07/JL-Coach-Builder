import { ContentImage as Image } from '@/components/shared/content-image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPage, getRelatedPosts } from '@/lib/sanity/blog';
import { getPublicContent } from '@/lib/sanity/public-content';
import { pageMetadata } from '@/lib/metadata';
import { pageUrl } from '@/lib/site-url';
import { RichText } from '@/components/blog/portable-text';
import { ArticleCards, BlogCta } from '@/components/blog/blog-list';
import { BlogSidebar } from '@/components/blog/blog-sidebar';
import { RelatedPages } from '@/components/shared/related-pages';
import '@/components/home/home.css';
import '@/components/content/content.css';
export const revalidate = 60;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getBlogPost((await params).slug), { siteSettings } = await getPublicContent();
  if (!post) return pageMetadata({ title: 'Page not found', description: '', path: '/blogs/', index: false, settings: siteSettings, routeOverride: false });
  return pageMetadata({ ...post.seo, title: post.seo?.title || post.title, description: post.seo?.description || post.excerpt, ogImage: post.seo?.ogImage || post.featuredImage, path: '/blogs/' + post.slug.current + '/', settings: siteSettings, type: 'article', publishedTime: post.publishedAt });
}
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getBlogPost((await params).slug); if (!post) notFound();
  const [page, related, { siteSettings }] = await Promise.all([getBlogPage(), getRelatedPosts(post), getPublicContent()]);
  const url = pageUrl('/blogs/' + post.slug.current, siteSettings.url);
  const structured = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.excerpt, datePublished: post.publishedAt, author: post.author ? { '@type': 'Person', name: post.author.name } : undefined, image: post.featuredImage?.src, mainEntityOfPage: url, publisher: { '@type': 'Organization', name: siteSettings.business.name } };
  return <div className="home-page interior-shell"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, '\u003c') }} />
    <section className="container section-pad"><Link className="underlink" href="/blogs/">{page.settings.backLabel}</Link>{post.category && <p className="kicker">{post.category.title}</p>}<h1>{post.title}</h1>{post.excerptRich?.length ? <div className="section-prose"><RichText value={post.excerptRich} /></div> : <p>{post.excerpt}</p>}<p>{page.settings.dateLabel} <time dateTime={post.publishedAt}>{new Intl.DateTimeFormat('en-NZ', { dateStyle: 'long', timeZone: 'Pacific/Auckland' }).format(new Date(post.publishedAt))}</time>{post.author && <> · {page.settings.authorLabel} {post.author.name}</>}</p>
    {post.author?.role && <p>{post.author.role}</p>}
    {post.author?.photo?.src && <Image src={post.author.photo.src} alt={post.author.photo.alt} caption={post.author.photo.caption} decorative={post.author.photo.decorative} focalPoint={post.author.photo.focalPoint} width={post.author.photo.width} height={post.author.photo.height} sizes="160px" />}
    {post.author?.bio?.length ? <div className="section-prose"><RichText value={post.author.bio} /></div> : null}
    {post.author?.socialLinks?.map(link => <Link key={link.href} className="underlink" href={/^(https?:\/\/|\/(?!\/)|mailto:|tel:)/i.test(link.href) ? link.href : '#'}>{link.label}</Link>)}
    {post.tags?.length ? <p>{page.settings.tagsLabel}: {post.tags.map(tag => <Link className="underlink" key={tag._id} href={'/blogs/?tag=' + encodeURIComponent(tag.slug.current)}>{tag.title}</Link>)}</p> : null}
    {post.featuredImage?.src && <Image src={post.featuredImage.src} caption={post.featuredImage.caption} decorative={post.featuredImage.decorative} focalPoint={post.featuredImage.focalPoint} alt={post.featuredImage.alt} width={post.featuredImage.width} height={post.featuredImage.height} sizes="100vw" priority />}</section>
    <section className={'container section-pad ' + (page.sidebar.enabled ? 'grid gap-8 lg:grid-cols-[1fr_300px]' : '')}><article className="section-prose"><RichText value={post.body} /></article><BlogSidebar /></section>
    {related.length > 0 && <section className="container section-pad"><h2>{page.settings.relatedTitle}</h2><ArticleCards posts={related} readMore={page.settings.readMore} /></section>}<RelatedPages links={post.relatedLinks} title={post.relatedLinksTitle} /><BlogCta value={page.footerCta} />
  </div>;
}
