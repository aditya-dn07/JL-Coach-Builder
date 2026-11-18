import type { Metadata } from 'next';
import { Studio } from './studio';
export const dynamic = 'force-static';
export const metadata: Metadata = { title: 'Content Studio', robots: { index: false, follow: false } };
export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return <section className="container section-pad"><h1>Content Studio</h1><p>Configure the Sanity project and dataset environment variables to open Studio.</p></section>;
  return <Studio />;
}
