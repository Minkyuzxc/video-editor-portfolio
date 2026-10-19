import express from 'express';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-only-secret';
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) throw new Error('Set JWT_SECRET in production');
const SERVICES = { 'Discovery call': 30, 'Edit review': 60, 'Project kickoff': 90 }; // minutes
const FILE = path.resolve('server/db.json');
const load = () => (fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE)) : { users: [], bookings: [] });
const save = (d) => fs.writeFileSync(FILE, JSON.stringify(d, null, 2));
const tokenOf = (req) => (req.headers.authorization || '').slice(7);
const sign = (u) => jwt.sign({ id: u.id }, SECRET, { expiresIn: '7d' });
const reply = (u) => ({ token: sign(u), user: { name: u.name, email: u.email } });
const auth = (req, res, next) => {
  try { req.user = jwt.verify(tokenOf(req), SECRET); next(); } catch { res.status(401).json({ error: 'Sign in to continue' }); }
};

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(express.static('dist'));

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || String(password || '').length < 8) return res.status(400).json({ error: 'Enter a name, an email and a password of 8+ characters' });
  const db = load(), mail = String(email).toLowerCase();
  if (db.users.some((u) => u.email === mail)) return res.status(409).json({ error: 'That email already has an account. Sign in instead' });
  const user = { id: Date.now().toString(36), name: String(name).slice(0, 60), email: mail, hash: await bcrypt.hash(String(password), 10) };
  db.users.push(user); save(db);
  res.json(reply(user));
});

app.post('/api/login', async (req, res) => {
  const u = load().users.find((x) => x.email === String(req.body.email).toLowerCase());
  if (!u || !(await bcrypt.compare(String(req.body.password), u.hash))) return res.status(401).json({ error: 'Email or password is incorrect' });
  res.json(reply(u));
});

// Public busy blocks; a signed-in visitor also sees their own bookings highlighted.
app.get('/api/events', (req, res) => {
  let uid; try { uid = jwt.verify(tokenOf(req), SECRET).id; } catch {}
  res.json(load().bookings.map((b) => ({
    id: b.id, start: b.start, end: b.end,
    title: b.userId === uid ? `Your ${b.service}` : 'Booked',
    color: b.userId === uid ? '#f2a541' : '#33445f', textColor: b.userId === uid ? '#0e1726' : '#e9eef5',
  })));
});

app.post('/api/bookings', auth, (req, res) => {
  const { service, start, notes = '' } = req.body, mins = SERVICES[service], s = new Date(start);
  if (!mins || isNaN(s) || s < new Date()) return res.status(400).json({ error: 'Choose a session and a start time in the future' });
  const e = new Date(s.getTime() + mins * 6e4), db = load();
  if (db.bookings.some((b) => s < new Date(b.end) && e > new Date(b.start))) return res.status(409).json({ error: 'That time is taken. Pick another slot' });
  db.bookings.push({ id: Date.now().toString(36), userId: req.user.id, service, notes: String(notes).slice(0, 500), start: s.toISOString(), end: e.toISOString() });
  save(db);
  res.json({ ok: true });
});

app.listen(process.env.PORT || 3001, () => console.log('API on :' + (process.env.PORT || 3001)));
