import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from './Hero';
import Events from './Events';
import Contact from './Contact';

// Edit these: name, email and the work cards. formUrl is optional (see README).
// A work href can be a full TikTok, YouTube or Vimeo link. The video then plays in a pop-up on your site.
const SITE = { name: 'James Lumayag', email: 'lumayagjames64@gmail.com' };
const WORK = [
  { title: 'Video edit #1', note: 'Brand film for a ceramics studio', length: '2:10', href: '#' },
  { title: 'Video edit #2', note: 'Festival documentary, 38-minute cut', length: '38:00', href: '#' },
  { title: 'Video edit #3', note: 'Launch trailer with motion graphics', length: '0:45', href: '#' },
];

// Turns a public video link into an embeddable player. Returns null for anything else.
const embed = (u) => {
  let m;
  if ((m = u.match(/tiktok\.com\/.*\/video\/(\d+)/))) return { src: `https://www.tiktok.com/@doyrimon/video/7603526025791737096${m[1]}`, tall: true };
  if ((m = u.match(/tiktok\.com\/.*\/video\/(\d+)/))) return { src: `https://www.tiktok.com/@doyrimon/video/7537793143538830600${m[1]}?autoplay=1`, tall: false };
  if ((m = u.match(/tiktok\.com\/.*\/video\/(\d+)/))) return { src: `https://www.tiktok.com/@doyrimon/video/7527534045132049672${m[1]}?autoplay=1`, tall: false };
  return null;
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
    if (v) { e.preventDefault(); setPlaying({ ...v, title: w.title }); } // otherwise the link opens normally
  };

  return (
    <>
      <header className="nav">
        <a href="#top" className="logo">{SITE.name}</a>
        <nav><a href="#work">Work</a><a href="#events">Events</a><a href="#contact">Contact</a></nav>
      </header>
      <Hero />
      <section id="work" className="wrap">
        <h2>Recent cuts</h2>
        <div className="grid">
          {WORK.map((w, i) => (
            <motion.a key={w.title} href={w.href} onClick={open(w)} className="clip" whileHover={{ y: -6 }} whileTap={{ scale: 0.98 }}>
              <div className="poster" style={{ '--hue': 190 + i * 55 }} />
              <h3>{w.title}</h3>
              <p>{w.note}</p>
              <span>{w.length}</span>
            </motion.a>
          ))}
        </div>
      </section>
      <section id="events" className="wrap">
        <h2>Events</h2>
        <Events />
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
