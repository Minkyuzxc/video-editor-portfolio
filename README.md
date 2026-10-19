# Video editor portfolio

React + Vite front end with a WebGL hero, Framer Motion transitions, a FullCalendar availability view, and a small Express API for sign-in and bookings.

## Run it
```bash
npm install
cp .env.example .env      # set JWT_SECRET (export it, or use your host's env settings)
npm run dev               # site on http://localhost:5173, API on :3001
```
Production: `npm run build && NODE_ENV=production JWT_SECRET=... npm start` serves `dist/` and the API on one port.

## Make it yours
- `src/App.jsx`: your name, email and the work cards (`SITE`, `WORK`).
- `src/styles.css`: colour tokens at the top (`:root`).
- `SERVICES` in `server/index.js` and `src/Booking.jsx`: session names and lengths (keep both in sync).

## How it fits together
1. **Layout:** one page, CSS Grid. `.grid` auto-fits the work cards; `.split` puts calendar and booking side by side and stacks below 900px.
2. **Hero:** `Hero.jsx` draws a full-screen fragment shader in raw WebGL (no library). Pointer position bends the noise; reduced-motion users get one still frame; no-WebGL browsers get the CSS gradient.
3. **Calendar:** `Events.jsx` loads `/api/events`. Others' bookings show as "Booked" (no names); yours show highlighted. Clicking a slot fills the booking form.
4. **Booking and auth:** `Booking.jsx` swaps between sign-in, sign-up and booking with `AnimatePresence`. The server hashes passwords (bcrypt), issues 7-day JWTs, and rejects past or overlapping slots.
5. **Motion:** one orchestrated hero entrance, a form transition when state changes, and press/hover feedback on cards and buttons.

## Before going live
- Storage is `server/db.json`, fine for one editor's calendar. Swap `load`/`save` for Postgres or SQLite if traffic grows.
- Add rate limiting on `/api/login` and `/api/register`, HTTPS, and booking-confirmation emails.
- Availability is "any open time". Restrict hours in `server/index.js` if needed.

## Publish to GitHub
```bash
git init && git add . && git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Minkyuzxc/video-editor-portfolio.git
git push -u origin main
```
