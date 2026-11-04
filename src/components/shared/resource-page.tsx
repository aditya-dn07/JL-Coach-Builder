import type { ReactNode } from 'react';
import Link from 'next/link';
import type { ContentPage } from '@/content/schema';
import { PageStructuredData } from '@/components/seo/page-structured-data';
import { TwoToneHeading } from './two-tone-heading';

export function ResourcePage({ page, children }: { page: ContentPage; children: ReactNode }) {
  return <div className="bg-[#101317] text-[#f3f5f7]">
    <PageStructuredData page={page} />
    <div className="mx-auto max-w-[1380px] px-5 py-14 sm:px-8 sm:py-20">
      <nav aria-label="Breadcrumb" className="mb-9 flex gap-3 text-sm text-[#b9c6d5]">
        <Link href="/" className="hover:text-white">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{page.label}</span>
      </nav>
      <header className="mb-10 max-w-[900px]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[.16em] text-brand">{page.eyebrow}</p>
        <h1 className="text-[clamp(34px,5vw,64px)] leading-[1.1]"><TwoToneHeading text={page.title} /></h1>
        <p className="mt-6 text-[15px] leading-[1.85] text-[#b9c6d5]">{page.description}</p>
      </header>
      {children}
    </div>
  </div>;
}
