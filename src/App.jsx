import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from './Hero';
import Contact from './Contact';
import Work from './Work';
import { SITE, WORK } from './content';


// Turns a public video link into an embeddable player. Returns null for anything else.
const embed = (u) => {
  let m;
  if ((m = u.match(/tiktok\.com\/.*\/video\/(\d+)/))) return { src: `https://www.tiktok.com/embed/v2/${m[1]}`, tall: true };
  if ((m = u.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/))) return { src: `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1`, tall: false };
  if ((m = u.match(/vimeo\.com\/(\d+)/))) return { src: `https://player.vimeo.com/video/${m[1]}?autoplay=1`, tall: false };
  return null;
};

export default function App() {
  const [playing, setPlaying] = useState(null);
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setPlaying(null);
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);
  const open = (w, e) => {
    const v = embed(w.href);
    if (v) { e.preventDefault(); setPlaying({ ...v, title: w.title }); } // otherwise the link opens normally
  };

  return (
    <>
      <header className="nav">
        <a href="#top" className="logo">{SITE.name}</a>
        <nav><a href="#work">Work</a><a href="#contact">Contact</a></nav>
      </header>
      <Hero />
      <section id="work" className="wrap">
        <h2>Recent cuts</h2>
        <Work items={WORK} onPlay={open} />
        <p className="hint">Hold and drag, or swipe, to see more</p>
      </section>
      <section id="contact" className="wrap split">
        <div>
          <h2>Have footage that needs a cut?</h2>
          <p className="lede">Tell me about the project, how long it should run and when you need it. You can also write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        </div>
        <Contact email={SITE.email} formUrl={SITE.formUrl} />
      </section>
      <AnimatePresence>
        {playing && (
          <motion.div className="modal" role="dialog" aria-modal="true" aria-label={playing.title} onClick={() => setPlaying(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={playing.tall ? 'player tall' : 'player'} onClick={(e) => e.stopPropagation()} initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }}>
              <iframe src={playing.src} title={playing.title} allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen />
              <button className="btn close" onClick={() => setPlaying(null)}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
