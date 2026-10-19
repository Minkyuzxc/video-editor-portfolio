# Video editor portfolio

A static React + Vite site: WebGL hero, work videos that play in a pop-up, an events calendar, and a contact form. There is no server or database.

## Run it
```bash
npm install
npm run dev     # http://localhost:5173
```

## Make it yours
- `src/App.jsx`: your name, email and work cards (`SITE`, `WORK`). Use full TikTok, YouTube or Vimeo links; they play in a pop-up.
- `src/Events.jsx`: the `EVENTS` list shown on the calendar.
- `src/styles.css`: colour tokens at the top (`:root`).

## Contact form
Out of the box, Send message opens the visitor's email app with the message filled in. To receive messages directly:
1. Create a free form at formspree.io and copy its address (it looks like `https://formspree.io/f/abcdwxyz`).
2. Paste it into `formUrl` in `src/App.jsx`.

## Deploy (free static hosting)
On Netlify or Vercel, import the GitHub repo. Build command `npm run build`, output folder `dist`. It redeploys on every push.

## Publish to GitHub
```bash
git add . && git commit -m "Update site" && git push
```
