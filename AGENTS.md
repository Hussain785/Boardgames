# AGENTS.md

Guidance for AI agents working in this repository.

## Project overview

Lovelink is a static, client-only React SPA for composing and sharing long-distance love letters. Letter data is encoded in the URL hash fragment; there is no backend or database.

## Cursor Cloud specific instructions

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Vite dev server | `npm run dev` | 5173 | Primary development server with HMR |
| Vite preview | `npm run preview` | 4173 (default) | Serves production build from `dist/` after `npm run build` |
| PlayVerse games | `npm run dev` → `/games` | 5173 | Telegram Mini App game hub (PeerJS online rooms) |

Only one static server is required. No Docker, database, or backend services exist.

### Standard commands

See `package.json` scripts and `README.md`:

- **Install deps:** `npm install`
- **Dev:** `npm run dev`
- **Lint:** `npm run lint`
- **Typecheck:** `npm run typecheck`
- **Build:** `npm run build`
- **Preview:** `npm run preview`

### Smoke test (no browser)

`node scripts/test-encoding.mjs` verifies base64url letter payload roundtrip encoding.

### End-to-end manual test

1. Start `npm run dev` and open `http://localhost:5173`
2. Home → **Write your letter** → fill compose form → **Send it with love**
3. Open the generated `/letter#...` share URL and click the envelope to reveal the letter

External share targets (WhatsApp, Telegram, email) and Google Fonts CDN are optional; core compose → share → open flow works without them.
