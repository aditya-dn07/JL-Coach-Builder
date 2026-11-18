import Link from 'next/link';
import { getSiteContent } from '../../lib/sanity/site-content';
import { getBlogPage, getBlogPosts, getCategories, getFeaturedPosts, referenceIds } from '../../lib/sanity/blog';
export async function BlogSidebar() {
  const { sidebar } = await getBlogPage();
  const { siteConfig } = await getSiteContent(); if (!sidebar.enabled) return null;
  const curatedIds = referenceIds(sidebar.curatedPosts);
  const posts = curatedIds.length ? await getFeaturedPosts(curatedIds, Math.max(1, Math.min(10, sidebar.recentPostsLimit))) : await getBlogPosts('', 1, Math.max(1, Math.min(10, sidebar.recentPostsLimit)));
  const ids = referenceIds(sidebar.categories);
  const categories = (await getCategories()).filter(category => !ids.length || ids.includes(category._id));
  return <aside className="rounded-lg border border-line p-6"><h2>{sidebar.heading}</h2>
    <ul>{categories.map(category => <li key={category._id}><Link className="underlink" href={'/blog/?category=' + encodeURIComponent(category.slug.current)}>{category.title}</Link></li>)}</ul>
    <ul>{posts.map(post => <li key={post._id}><Link className="underlink" href={'/blog/' + post.slug.current + '/'}>{post.title}</Link></li>)}</ul>
    {sidebar.ctaEnabled && <div><h3>{sidebar.ctaTitle}</h3><a className="button primary" href={sidebar.ctaHref || siteConfig.ui.quoteTarget}>{sidebar.ctaLabel}</a></div>}
  </aside>;
}
