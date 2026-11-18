import { ContentImage as Image } from '@/components/shared/content-image';
import Link from 'next/link';
import { getBlogPage, getBlogPosts, getCategories, getFeaturedPosts, referenceIds } from '@/lib/sanity/blog';
import { getPublicContent } from '@/lib/sanity/public-content';
import { pageMetadata } from '@/lib/metadata';
import { ArticleCards, BlogCta } from '@/components/blog/blog-list';
import { BlogSidebar } from '@/components/blog/blog-sidebar';
import '@/components/home/home.css';
import '@/components/content/content.css';
export const revalidate = 60;
export async function generateMetadata() {
  const [{ seo }, { siteSettings }] = await Promise.all([getBlogPage(), getPublicContent()]);
  return pageMetadata({ ...seo, settings: siteSettings, path: '/blogs/' });
}
export default async function Blog({ searchParams }: { searchParams: Promise<{ category?: string; page?: string; tag?: string }> }) {
  const values = await searchParams, page = await getBlogPage();
  const current = Math.min(10000, Math.max(1, Number.parseInt(values.page || '1', 10) || 1));
  const size = Math.min(30, Math.max(1, page.settings.pageSize));
  const category = values.category || '';
  const [posts, allCategories, featured] = await Promise.all([getBlogPosts(category, current, size, true, values.tag || ''), getCategories(), getFeaturedPosts(referenceIds(page.featured.posts), Math.max(0, Math.min(12, page.featured.maximum)))]);
  const selected = referenceIds(page.filters.categories);
  const categories = allCategories.filter(item => !selected.length || selected.includes(item._id));
  const href = (number: number) => '/blogs/?' + new URLSearchParams({ ...(category ? { category } : {}), ...(values.tag ? { tag: values.tag } : {}), page: String(number) }).toString();
  return <div className="home-page interior-shell">
    <section className="container section-pad">{page.banner.image.src && <Image src={page.banner.image.src} caption={page.banner.image.caption} decorative={page.banner.image.decorative} focalPoint={page.banner.image.focalPoint} alt={page.banner.image.alt} width={page.banner.image.width} height={page.banner.image.height} sizes="100vw" priority />}<p className="kicker">{page.banner.eyebrow}</p><h1>{page.banner.title}</h1><p>{page.banner.description}</p><div className="mt-6 flex flex-wrap gap-3">{(page.banner.actions as { label: string; href: string }[]).map((action, index) => <Link className="button primary" key={index} href={/^(https?:\/\/|\/(?!\/)|mailto:|tel:|#)/i.test(action.href) ? action.href : '#quote'}>{action.label}</Link>)}</div></section>
    <nav className="container flex flex-wrap gap-5 pb-8" aria-label={page.filters.ariaLabel}><span className="font-semibold">{page.filters.title}</span><Link className="underlink" href="/blogs/">{page.filters.allLabel}</Link>{categories.map(item => <Link className="underlink" key={item._id} href={'/blogs/?category=' + encodeURIComponent(item.slug.current)}>{item.title}{page.filters.showCounts ? ` (${item.count})` : ''}</Link>)}</nav>
    {featured.length > 0 && current === 1 && !category && <section className="container section-pad"><h2>{page.featured.title}</h2><ArticleCards posts={featured} readMore={page.settings.readMore} /></section>}
    <section className={'container section-pad ' + (page.sidebar.enabled ? 'grid gap-8 lg:grid-cols-[1fr_300px]' : '')}><div><h2>{page.settings.title}</h2>{posts.length ? <ArticleCards posts={posts.slice(0, size)} readMore={page.settings.readMore} /> : <p>{page.settings.emptyMessage}</p>}
      <nav className="mt-8 flex gap-6" aria-label={page.settings.title}>{current > 1 && <Link className="underlink" href={href(current - 1)}>{page.settings.previousLabel}</Link>}{posts.length > size && <Link className="underlink" href={href(current + 1)}>{page.settings.nextLabel}</Link>}</nav>
    </div><BlogSidebar /></section>
    <BlogCta value={page.internalCta} /><BlogCta value={page.footerCta} />
  </div>;
}
