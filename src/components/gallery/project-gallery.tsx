'use client';
import Image from 'next/image';
import { InteriorSectionFrame, InteriorSectionHeader } from '@/components/shared/section-intro';
import { useEffect, useRef, useState } from 'react';
import type { ContentPage, ContentImage, SiteSettings } from '@/content/schema';
import { InteriorReveal } from '@/components/content/animated-benefit-card';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { LinkedText } from '@/components/content/related-services';

export function ProjectGallery({ photos, page, ui }: { photos: ContentImage[]; page: ContentPage; ui: SiteSettings['ui'] }) {
  const [limit, setLimit] = useState(18);
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const isOpen = selected !== null;
  useEffect(() => {
    if (!isOpen) return;
    const current = dialog.current;
    if (!current) return;
    const previousOverflow = document.body.style.overflow;
    current.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      current.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);
  function close() {
    dialog.current?.close();
    setSelected(null);
    opener.current?.focus({ preventScroll: true });
  }
  function move(amount: number) {
    setSelected((current) => current === null ? null : (current + amount + photos.length) % photos.length);
  }
  return (
    <InteriorSectionFrame id="page-details" className="project-gallery">
      <InteriorSectionHeader><p className="kicker">{page.sections[0].eyebrow}</p><h2 id="gallery-title"><TwoToneHeading text={page.sections[0].title} /></h2><p><LinkedText text={page.sections[0].description ?? ''} links={page.sections[0].descriptionLinks} /></p></InteriorSectionHeader>
      <div className="project-photo-grid">
        {photos.slice(0, limit).map((photo, index) => <InteriorReveal key={photo.src} delay={Math.min(index % 6, 6) * 0.07}><figure className="vehicle-card !col-auto !flex !flex-col">
          <button className="vehicle-photo" type="button" onClick={(event) => { opener.current = event.currentTarget; setSelected(index); }} aria-label={`${ui.galleryOpen}${index + 1}`}>
            <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" loading="lazy" />
            <span className="photo-view-label">{ui.galleryView}</span>
          </button>
        </figure></InteriorReveal>)}
      </div>
      <div className="gallery-load-more"><p aria-live="polite">{ui.galleryShowing}{Math.min(limit, photos.length)}{ui.galleryOf}{photos.length}{ui.galleryPhotographs}</p>{limit < photos.length && <button className="button primary" type="button" onClick={() => setLimit((current) => current + 18)}>{ui.galleryMore}</button>}</div>
      <dialog className="project-viewer" ref={dialog} aria-label={ui.galleryViewer} onCancel={close} onClick={(event) => { if (event.target === event.currentTarget) close(); }} onKeyDown={(event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); } if (event.key === 'ArrowRight') { event.preventDefault(); move(1); } }}>
        {selected !== null && <div className="project-viewer-content">
          <div className="project-viewer-toolbar"><span>{ui.galleryPhoto}{selected + 1}{ui.galleryOf}{photos.length}</span><button className="underlink" type="button" onClick={close} autoFocus>{ui.galleryClose}</button></div>
          <div className="project-viewer-image"><Image src={photos[selected].src} alt={photos[selected].alt} fill sizes="90vw" /></div>
          <div className="project-viewer-controls"><button className="underlink" type="button" onClick={() => move(-1)}>{ui.galleryPrevious}</button><a className="underlink" href={photos[selected].src} target="_blank" rel="noreferrer">{ui.galleryOriginal}</a><button className="underlink" type="button" onClick={() => move(1)}>{ui.galleryNext}</button></div>
        </div>}
      </dialog>
    </InteriorSectionFrame>
  );
}
