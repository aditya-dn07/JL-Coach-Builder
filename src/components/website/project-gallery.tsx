'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type ProjectPhoto = { src: string; alt: string; width: number; height: number };

export function ProjectGallery({ photos }: { photos: ProjectPhoto[] }) {
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
    <section className="container section-pad project-gallery" id="page-details" aria-labelledby="gallery-title">
      <div className="project-gallery-heading"><div><p className="kicker">From the workshop</p><h2 id="gallery-title">The work speaks for itself.</h2></div><p>Browse {photos.length} photographs of vehicles, repairs and workshop projects. Select any photo for a closer look.</p></div>
      <div className="project-photo-grid">
        {photos.slice(0, limit).map((photo, index) => <figure key={photo.src}>
          <button type="button" onClick={(event) => { opener.current = event.currentTarget; setSelected(index); }} aria-label={`View workshop photograph ${index + 1}`}>
            <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" loading="lazy" />
            <span className="photo-view-label">View photograph</span>
          </button>
          <figcaption><span>Workshop project {String(index + 1).padStart(2, '0')}</span><span>JL Coachbuilders</span></figcaption>
        </figure>)}
      </div>
      <div className="gallery-load-more"><p aria-live="polite">Showing {Math.min(limit, photos.length)} of {photos.length} photographs</p>{limit < photos.length && <button className="button primary" type="button" onClick={() => setLimit((current) => current + 18)}>Show more projects</button>}</div>
      <dialog className="project-viewer" ref={dialog} aria-label="Workshop photograph viewer" onCancel={close} onClick={(event) => { if (event.target === event.currentTarget) close(); }} onKeyDown={(event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); } if (event.key === 'ArrowRight') { event.preventDefault(); move(1); } }}>
        {selected !== null && <div className="project-viewer-content">
          <div className="project-viewer-toolbar"><span>Workshop photograph {selected + 1} of {photos.length}</span><button className="underlink" type="button" onClick={close} autoFocus>Close photo</button></div>
          <div className="project-viewer-image"><Image src={photos[selected].src} alt={photos[selected].alt} fill sizes="90vw" /></div>
          <div className="project-viewer-controls"><button className="underlink" type="button" onClick={() => move(-1)}>Previous photo</button><a className="underlink" href={photos[selected].src} target="_blank" rel="noreferrer">Open original photo</a><button className="underlink" type="button" onClick={() => move(1)}>Next photo</button></div>
        </div>}
      </dialog>
    </section>
  );
}
