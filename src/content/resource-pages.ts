import type { ContentPage } from './schema';

function resourcePage(slug: string, label: string, title: string, description: string): ContentPage {
  return {
    id: slug, slug, label, title, eyebrow: label, description,
    intro: [], kind: 'about', image: 'workshop',
    seo: { title: `${label} | JL Coachbuilders`, description },
    sections: [], faqs: [],
  };
}

export const reviewsPage = resourcePage('reviews', 'Customer Reviews', 'What Our Customers Say',
  'Read customer experiences with JL Coachbuilders in Christchurch. Browse a selection of reviews here and visit Google for the complete collection.');

export const faqsPage = resourcePage('faqs', 'FAQs', 'Common Questions Before You Book',
  'Find answers about repairs, servicing, insurance, turnaround times and the caravans, motorhomes and other vehicles we work on.');

export const resourcePages = [reviewsPage, faqsPage];
