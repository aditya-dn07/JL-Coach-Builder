'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 300);
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  if (!visible) return null;

  return (
    <a
      href="#top"
      aria-label="Back to top"
      title="Back to top"
      className="fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-brand text-white shadow-[0_4px_20px_#0006] transition-colors hover:bg-[#d40000] sm:bottom-6 sm:right-6"
    >
      <ArrowUp size={20} aria-hidden="true" />
    </a>
  );
}
