import { notFound } from 'next/navigation';

// Keep unmatched multi-segment URLs inside the website's styled layout.
export default function UnknownWebsitePage() {
  notFound();
}
