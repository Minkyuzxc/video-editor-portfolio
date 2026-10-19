import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from './api';

const SERVICES = { 'Discovery call': 30, 'Edit review': 60, 'Project kickoff': 90 }; // keep in sync with server/index.js
const slide = { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 }, transition: { duration: 0.25 } };

export default function Booking({ session, setSession, picked, onBooked }) {
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', password: '', service: 'Discovery call', start: '', notes: '' });
  const [msg, setMsg] = useState(null);

  useEffect(() => { // clicking a calendar slot fills the start time
    if (picked) setF((x) => ({ ...x, start: new Date(picked - picked.getTimezoneOffset() * 6e4).toISOString().slice(0, 16) }));
  }, [picked]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (fn) => async (e) => {
    e.preventDefault(); setMsg(null);
    try { await fn(); } catch (err) { setMsg({ err: err.message }); }
  };
  const authenticate = submit(async () => setSession(await api('/' + mode, { method: 'POST', body: f })));
  const book = submit(async () => {
    await api('/bookings', { method: 'POST', token: session.token, body: { ...f, start: new Date(f.start).toISOString() } });
    setMsg({ ok: 'Booked. Your slot is now on the calendar.' });
    onBooked();
  });

  return (
    <aside className="panel">
      <AnimatePresence mode="wait">
        {session ? (
          <motion.form key="book" onSubmit={book} {...slide}>
            <h3>Hi {session.user.name}, choose a session</h3>
            <label>Session
              <select value={f.service} onChange={set('service')}>
                {Object.entries(SERVICES).map(([k, m]) => <option key={k} value={k}>{k}, {m} min</option>)}
              </select>
            </label>
            <label>Start<input type="datetime-local" required value={f.start} onChange={set('start')} /></label>
            <label>What are we working on?<textarea rows="3" maxLength="500" value={f.notes} onChange={set('notes')} /></label>
            <button className="btn">Confirm booking</button>
            <button type="button" className="link" onClick={() => setSession(null)}>Sign out</button>
          </motion.form>
        ) : (
          <motion.form key="auth" onSubmit={authenticate} {...slide}>
            <h3>{mode === 'login' ? 'Sign in to book' : 'Create an account to book'}</h3>
            {mode === 'register' && <label>Name<input required autoComplete="name" value={f.name} onChange={set('name')} /></label>}
            <label>Email<input type="email" required autoComplete="email" value={f.email} onChange={set('email')} /></label>
            <label>Password<input type="password" required minLength="8" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={f.password} onChange={set('password')} /></label>
            <button className="btn">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
            <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'New here? Create an account' : 'Have an account? Sign in'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      <p role="status" className={msg?.err ? 'err' : 'ok'}>{msg?.err || msg?.ok}</p>
    </aside>
  );
}
