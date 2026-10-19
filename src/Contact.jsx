import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const slide = { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 }, transition: { duration: 0.25 } };

export default function Contact({ email, formUrl }) {
  const [f, setF] = useState({ name: '', email: '', message: '' });
  const [state, setState] = useState('idle'); // idle, sending, sent, error
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const send = async (e) => {
    e.preventDefault();
    if (!formUrl) { // no form service set up yet: open the visitor's email app with the message filled in
      location.href = `mailto:${email}?subject=${encodeURIComponent('Project enquiry from ' + f.name)}&body=${encodeURIComponent(`${f.message}\n\n${f.name} (${f.email})`)}`;
      return;
    }
    setState('sending');
    try {
      const r = await fetch(formUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(f) });
      if (!r.ok) throw new Error();
      setF({ name: '', email: '', message: '' });
      setState('sent');
    } catch { setState('error'); }
  };

  return (
    <aside className="panel">
      <AnimatePresence mode="wait">
        {state === 'sent' ? (
          <motion.div key="done" {...slide}>
            <h3>Message sent</h3>
            <p className="lede">Thanks for reaching out. I'll reply by email.</p>
            <button type="button" className="link" onClick={() => setState('idle')}>Send another message</button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={send} {...slide}>
            <h3>Contact me</h3>
            <label>Name<input required autoComplete="name" value={f.name} onChange={set('name')} /></label>
            <label>Email<input type="email" required autoComplete="email" value={f.email} onChange={set('email')} /></label>
            <label>Tell me about your project<textarea required rows="5" maxLength="2000" value={f.message} onChange={set('message')} /></label>
            <button className="btn" disabled={state === 'sending'}>{state === 'sending' ? 'Sending' : 'Send message'}</button>
            {state === 'error' && <p className="err" role="alert">The message didn't send. Try again, or email {email}.</p>}
          </motion.form>
        )}
      </AnimatePresence>
    </aside>
  );
}
