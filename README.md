# simonbrightman-site

Executive portfolio and insights site for Simon Brightman.

## Quick start

```bash
npm install
npm run dev
```

Local preview runs on port **8888**. Production site: **simonbrightman.com**.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server with TTS functions |
| `npm run dev:static` | Static preview on port 3000 (no audio) |
| `npm run build` | Compile Tailwind CSS |
| `npm run deploy:draft` | Netlify preview deploy |
| `npm run deploy` | Production deploy + domain check |

## Adding an article

1. Create `insights/your-slug/index.html`
2. Add entry to `data/insights.json` and the inline JSON block in `insights/index.html`
3. Run `npm run build`

More detail: see `docs/development.txt`.
