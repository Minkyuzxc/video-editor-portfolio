import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from './Hero';
import Contact from './Contact';
import Work from './Work';

const SITE = { name: 'James Lumayag', email: 'lumayagjames64@gmail.com' };
const WORK = [
  {
    title: 'Thousand years',
    note: 'Polishing my skills',
    length: '00:35',
    href: 'https://www.tiktok.com/player/v1/7603526025791737096',
  },
  {
    title: 'When I was your man',
    note: 'Valorant edit that took me 1 day to complete',
    length: '00:37',
    href: 'https://www.tiktok.com/player/v1/7537793143538830600',
  },
  {
    title: 'Obsessed',
    note: 'Short Valorant edit for myself',
    length: '00:14',
    href: 'https://www.tiktok.com/player/v1/7527534045132049672',
  },
  {
    title: 'Baby 123',
    note: 'Trying the beat matching technique',
    length: '00:28',
    href: 'https://www.tiktok.com/player/v1/7697240308341329172',
  },
  {
    title: 'Positions',
    note: 'Short ariana grande edit for my valorant clips',
    length: '00:08',
    href: 'https://www.tiktok.com/player/v1/77598591160285678865',
  },  
];

const embed = (url) => {
  const match = url.match(
    /tiktok\.com\/@[^/]+\/video\/(\d+)/i
  );

  if (!match) return null;

  return {
    src: `https://www.tiktok.com/player/v1/${match[1]}?autoplay=1`,
    tall: true,
  };
};

export default function App() {
  const [playing, setPlaying] = useState(null);
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setPlaying(null);
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);
  const open = (w) => (e) => {
  const v = embed(w.href);

  if (v) {
    e.preventDefault();
    setPlaying({ ...v, title: w.title });
  }
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
