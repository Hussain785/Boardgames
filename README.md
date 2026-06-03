# Lovelink 💌

A beautiful little home for **long-distance love letters**.

Lovelink lets you write a romantic letter, count the days until you're
together, and send it as a private link only the two of you will ever open.
No accounts. No databases. No tracking. Just words, a heartbeat, and a
URL you can paste anywhere.

## ✨ Features

- **Compose with care** — A gentle, distraction-free editor with live
  preview, autosave, romantic prompts, and four hand-picked color themes
  (Rose / Sunset / Lavender / Ocean).
- **Live countdown** — Tick-by-tick countdown to your next reunion.
- **Days of us** — A quiet tally of every day you've been together.
- **Reasons I love you** — Up to 12 small, specific reasons.
- **Our song** — Drop a YouTube/Spotify/SoundCloud link.
- **Beautiful share** — Native share sheet, WhatsApp, Telegram, email,
  copy-link, and a romantic QR code.
- **Sealed envelope reveal** — When the recipient opens the link, a
  3D-feeling envelope animates open before the letter rises out.
- **Private by design** — The whole letter is encoded into the share
  link itself (in the URL hash, which is never sent to any server). No
  backend, no database, no logs.
- **Light & dark mode** — Soft daylight palette plus a midnight rose
  for the late-night letters.
- **Accessible** — Keyboard navigation, focus rings, reduced-motion
  support, semantic HTML, ARIA dialog, and dynamic light/dark color
  scheme.
- **Mobile-first responsive** — Looks beautiful on phones, tablets, and
  laptops.

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
# → http://localhost:5173

# 3. Build for production
npm run build

# 4. Preview the production build
npm run preview
```

## 📦 Tech stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS** (custom rose palette + romantic gradients)
- **Framer Motion** for animations
- **lucide-react** for icons
- **qrcode.react** for the share QR
- **react-router-dom** for navigation

## 🌐 Deploying

The app is a fully static SPA. It works on any static host. SPA fallback
configs are included for:

- **Vercel** — `vercel.json` (already set up)
- **Netlify** / **Cloudflare Pages** — `public/_redirects` (already set
  up)
- **GitHub Pages** — works for the home route, but for deep links you
  may need a custom 404.html redirect (the share URL itself stores the
  letter in the hash fragment, so even the home route can render
  letters if you adjust the route).

After running `npm run build`, the static site is in `dist/`. Just
upload it.

## 🔒 Privacy

There is no backend in Lovelink. When you click "Send it with love":

1. The letter is JSON-stringified and base64url-encoded in your
   browser.
2. That token is appended to the URL as a `#fragment`.
3. URL fragments are **never sent over the wire** by browsers, so the
   letter content never reaches any server — not even the host serving
   the site.

If you delete the link, you delete the letter.

## 🗂 Project structure

```
src/
├─ components/
│  ├─ Countdown.tsx      # Live "until we're together" countdown
│  ├─ Envelope.tsx       # Animated openable envelope
│  ├─ FloatingHearts.tsx # Decorative heart particle layer
│  ├─ Footer.tsx
│  ├─ LetterPaper.tsx    # The rendered letter
│  ├─ Navbar.tsx
│  └─ ShareDialog.tsx    # Multi-channel share + QR code
├─ hooks/
│  ├─ themeContext.ts
│  ├─ ThemeProvider.tsx
│  └─ useTheme.ts
├─ lib/
│  └─ letter.ts          # Encoding, decoding, drafts, helpers
├─ pages/
│  ├─ About.tsx
│  ├─ Compose.tsx
│  ├─ Home.tsx
│  ├─ Letter.tsx
│  └─ NotFound.tsx
├─ App.tsx
├─ index.css
└─ main.tsx
```

## 💡 Tips for writing a great letter

1. **Be specific.** The way they sip coffee. The sound right before
   they laugh. Specifics feel more like love than grand declarations.
2. **Write at night.** The world is quieter, and so is your filter.
3. **Don't overthink.** They love how you talk. So talk. Send it
   before you talk yourself out of how much you mean it.

Made with 💖 for the ones who love across the miles.

## 🎮 PlayVerse — Telegram Mini Games

Open **`/games`** for the PlayVerse hub: 15+ mini games with light/dark theme, touch controls, and online rooms (create a code → invite a friend via Telegram share).

**Telegram Mini App:** host the built `dist/` and set your bot’s Web App URL to your deployed `/games` route.

```bash
npm run dev
# → http://localhost:5173/games
```

