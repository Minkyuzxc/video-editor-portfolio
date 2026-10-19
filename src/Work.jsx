import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Hold and drag (mouse) or swipe (touch) from right to left to reveal more videos.
export default function Work({ items, onPlay }) {
  const track = useRef(), moved = useRef(false);
  const [limit, setLimit] = useState(0);
  useEffect(() => {
    const measure = () => setLimit(Math.max(0, track.current.scrollWidth - track.current.clientWidth));
    measure(); addEventListener('resize', measure);
    return () => removeEventListener('resize', measure);
  }, [items]);

  return (
    <div className="rail">
      <motion.div
        ref={track} className="track" drag="x" dragElastic={0.1} dragConstraints={{ left: -limit, right: 0 }}
        onDragStart={() => { moved.current = true; }}
        onDragEnd={() => setTimeout(() => { moved.current = false; }, 50)} // so letting go doesn't count as a click
      >
        {items.map((w, i) => (
          <a key={w.title} href={w.href} draggable="false" className="clip" onClick={(e) => (moved.current ? e.preventDefault() : onPlay(w, e))}>
            <div className="poster" style={{ '--hue': 190 + i * 55 }} />
            <h3>{w.title}</h3>
            <p>{w.note}</p>
            <span>{w.length}</span>
          </a>
        ))}
      </motion.div>
    </div>
  );
}
