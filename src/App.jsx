import { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from './Hero';
import Events from './Events';
import Booking from './Booking';

// Edit these: name, email and the work cards (replace href with your video links).
export const SITE = { name: 'Mara Vance', email: 'hello@example.com' };
const WORK = [
  { title: 'Video edit #1', note: 'Brand film for a ceramics studio', length: '2:10', href: '#' },
  { title: 'Video edit #2', note: 'Festival documentary, 38-minute cut', length: '38:00', href: '#' },
  { title: 'Video edit #3', note: 'Launch trailer with motion graphics', length: '0:45', href: '#' },
];

export default function App() {
  const [session, setSessionState] = useState(() => JSON.parse(localStorage.getItem('session') || 'null'));
  const [refresh, setRefresh] = useState(0);
  const [picked, setPicked] = useState(null);
  const setSession = (s) => {
    setSessionState(s);
    s ? localStorage.setItem('session', JSON.stringify(s)) : localStorage.removeItem('session');
  };

  return (
    <>
      <header className="nav">
        <a href="#top" className="logo">{SITE.name}</a>
        <nav><a href="#work">Work</a><a href="#book">Book a time</a><a href="#contact">Contact</a></nav>
      </header>
      <Hero />
      <section id="work" className="wrap">
        <h2>Recent cuts</h2>
        <div className="grid">
          {WORK.map((w, i) => (
            <motion.a key={w.title} href={w.href} className="clip" whileHover={{ y: -6 }} whileTap={{ scale: 0.98 }}>
              <div className="poster" style={{ '--hue': 190 + i * 55 }} />
              <h3>{w.title}</h3>
              <p>{w.note}</p>
              <span>{w.length}</span>
            </motion.a>
          ))}
        </div>
      </section>
      <section id="book" className="wrap split">
        <div>
          <h2>Pick a time</h2>
          <Events token={session?.token} refresh={refresh} onPick={setPicked} />
        </div>
        <Booking session={session} setSession={setSession} picked={picked} onBooked={() => setRefresh((r) => r + 1)} />
      </section>
      <footer id="contact" className="wrap">
        <h2>Have footage that needs a cut?</h2>
        <a className="btn" href={`mailto:${SITE.email}`}>Email {SITE.name.split(' ')[0]}</a>
      </footer>
    </>
  );
}
