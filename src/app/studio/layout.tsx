import type { Metadata } from 'next';
import './studio.css';
export const metadata: Metadata = { title: 'Content Studio', robots: { index: false, follow: false } };
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div data-sanity-studio>{children}</div>;
}
