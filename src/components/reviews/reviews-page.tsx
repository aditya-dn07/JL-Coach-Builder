import { contentRepository } from '@/content/repository';
import { getCustomerReviews } from '@/content/feedback';
import { reviewsPage } from '@/content/resource-pages';
import { googleReviewHref } from '@/config/site';
import { ResourcePage } from '@/components/shared/resource-page';
import { GoogleReviewLink } from '@/components/shared/google-review-link';

export async function CustomerReviewsPage() {
  const home = await contentRepository.getPage('');
  const reviews = home ? getCustomerReviews(home) : [];
  return <ResourcePage page={reviewsPage}>
    <div className="mb-10 flex flex-wrap items-center gap-5">
      <GoogleReviewLink />
      <a href={googleReviewHref} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex min-h-12 items-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-[#d40000]">View All Google Reviews <span aria-hidden="true" className="ml-2">↗</span></a>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      {reviews.map(review => <blockquote key={review.author} className="flex flex-col rounded-3xl border border-[#36414e] bg-[#1e2630] p-7 sm:p-8">
        <span aria-label="5 out of 5 stars" className="tracking-[.12em] text-[#ffb400]">★★★★★</span>
        <p className="mb-7 mt-5 text-[15px] leading-[1.85] text-[#d6dfe8]">{review.text}</p>
        <footer className="mt-auto flex items-center gap-3 text-sm">
          <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/20 font-semibold text-[#ff6b73]">{review.author[0]}</span>
          <cite className="not-italic">{review.author}</cite>
        </footer>
      </blockquote>)}
    </div>
  </ResourcePage>;
}
