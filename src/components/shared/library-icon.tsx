type IconName = 'plus-lg' | 'x-lg' | 'list' | 'tools' | 'calendar-check' | 'truck' | 'people' | 'check2-circle' | 'chat-square-text' | 'telephone' | 'shield-check' | 'paint-bucket' | 'sliders' | 'grid' | 'chevron-left' | 'chevron-right' | 'pause-fill' | 'play-fill';

/** Bootstrap Icons' font renderer keeps these controls free of inline SVG. */
export function LibraryIcon({ name, className = '' }: { name: IconName; className?: string }) {
  return <i className={`bi bi-${name} library-icon ${className}`} aria-hidden="true" />;
}
