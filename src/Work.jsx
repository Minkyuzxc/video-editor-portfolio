import { useEffect, useRef, useState } from 'react';

export default function Work({ items, onPlay }) {
  const track = useRef(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const element = track.current;
    if (!element) return undefined;

    const measure = () => setCanScroll(element.scrollWidth > element.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => observer.disconnect();
  }, [items]);

  const move = (direction) => {
    const element = track.current;
    if (!element) return;
    const card = element.querySelector('.clip');
    const distance = card ? card.getBoundingClientRect().width + 24 : element.clientWidth;
    element.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  return (
    <div className="carousel">
      {canScroll && (
        <div className="carousel-controls" aria-label="Video carousel controls">
          <button type="button" className="carousel-arrow" aria-label="Previous videos" onClick={() => move(-1)}>‹</button>
          <button type="button" className="carousel-arrow" aria-label="Next videos" onClick={() => move(1)}>›</button>
        </div>
      )}
      <div className="rail">
        <div
          ref={track}
          className="track"
          role="region"
          aria-roledescription="carousel"
          aria-label="Recent video work. Use the left and right arrow keys to browse."
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              move(event.key === 'ArrowLeft' ? -1 : 1);
            }
          }}
        >
          {items.map((w, i) => (
            <button key={w.title} type="button" className="clip" onClick={() => onPlay(w)}>
              <span className="poster" style={{ '--hue': 190 + i * 55 }} aria-hidden="true" />
              <span className="clip-title">{w.title}</span>
              <span className="clip-note">{w.note}</span>
              <span className="clip-length">{w.length}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="hint"></p>
    </div>
  );
}
