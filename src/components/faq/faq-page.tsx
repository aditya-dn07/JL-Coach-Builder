import Link from 'next/link';
import { contentRepository } from '@/content/repository';
import { faqsPage } from '@/content/resource-pages';
import { ResourcePage } from '@/components/shared/resource-page';
import { LibraryIcon } from '@/components/shared/library-icon';

export async function AllFaqsPage() {
  const pages = await contentRepository.getPages();
  const seen = new Set<string>();
  const groups = pages.map(page => ({ page, faqs: page.faqs.filter(faq => {
    const key = faq.question.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }) })).filter(group => group.faqs.length);

  return <ResourcePage page={{ ...faqsPage, faqs: groups.flatMap(group => group.faqs) }}>
    <nav aria-label="FAQ topics" className="mb-12 flex flex-wrap gap-2">
      {groups.map(({ page }) => <a key={page.id} href={`#faq-${page.id}`} className="rounded-full border border-[#36414e] px-4 py-2 text-sm text-[#d6dfe8] hover:border-brand hover:text-white">{page.kind === 'home' ? 'General questions' : page.label}</a>)}
    </nav>
    <div className="space-y-12">
      {groups.map(({ page, faqs }) => <section key={page.id} id={`faq-${page.id}`} className="scroll-mt-32">
        <h2 className="mb-5 text-2xl sm:text-3xl">{page.kind === 'home' ? 'General Questions' : page.label}</h2>
        <div className="grid items-start gap-3 md:grid-cols-2">
          {faqs.map(faq => <details key={faq.question} name={`faq-${page.id}`} className="group rounded-2xl border border-[#36414e] bg-[#1e2630] open:border-[#8b9caf]">
            <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 p-5 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
              {faq.question}<LibraryIcon name="plus-lg" className="shrink-0 transition-transform group-open:rotate-45" />
            </summary>
            <p className="px-5 pb-5 text-sm leading-[1.85] text-[#b9c6d5]">{faq.answer}</p>
          </details>)}
        </div>
      </section>)}
    </div>
    <div className="mt-12 rounded-3xl border border-[#36414e] p-7">
      <h2 className="text-2xl">Still Have a Question?</h2>
      <p className="mb-5 mt-3 text-sm leading-7 text-[#b9c6d5]">Talk to our team about your vehicle and the work you need.</p>
      <Link href="/contact/" className="inline-flex min-h-12 items-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-[#d40000]">Contact Our Team</Link>
    </div>
  </ResourcePage>;
}
