<h1 align="center">NHaiku FE 🌸</h1>

<p align="center">
  <strong>Self-hosted manga gallery frontend</strong>
</p>

<p align="center">
  <em>Visit, cache, forget</em><br>
  <em>Duplicates dissolved to one</em><br>
  <em>Yours, even offline</em>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/github/v/tag/Valcrist/nhaiku-fe?style=flat&label=version&color=brightgreen" alt="Version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-polyform--nc-orange?style=flat" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/github/languages/top/Valcrist/nhaiku-fe?style=flat" alt="Top Language"></a>
  <a href="https://github.com/Valcrist/nhaiku-fe/activity"><img src="https://img.shields.io/badge/status-active-green?style=flat" alt="Status"></a>
</p>

---

## Overview

NHaiku FE is the frontend for [NHaiku](https://github.com/Valcrist/nhaiku). It provides a self-hosted interface for browsing locally cached manga and remote sources, with de-duplication and offline-first design.

**Features:**

- Browse and search your local manga library with pagination
- Browse remote sources and trigger downloads
- Full manga viewer with cover, pages, tags, and metadata
- Voting and re-indexing support
- Lazy-loaded images with thumbnail caching
- Dark, responsive UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | SvelteKit 2 + Svelte 5 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Build | Vite 6 |
| Adapter | Auto (universal deployment) |
| Package manager | pnpm |

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- A running [NHaiku backend](https://github.com/Valcrist/nhaiku) instance


---

## Installation

```bash
git clone https://github.com/Valcrist/nhaiku-fe.git
cd nhaiku-fe
pnpm install
```

---

## Environment Variables


| Variable | Description |
|---|---|
| `API_URL` | NHaiku backend URL (e.g. `http://192.168.1.100:8069`) |

---

## Development

```bash
pnpm dev
```

The app runs at `http://localhost:5173` by default.

---

## Building for Production

```bash
pnpm build
pnpm preview   # preview the production build locally
```

---

## Project Structure

```
src/
├── routes/
│   ├── +page.server.ts       # Redirects / → /page/1
│   ├── page/[page]/          # Local gallery (paginated)
│   ├── r/page/[page]/        # Remote gallery (paginated)
│   └── g/[id]/               # Manga detail viewer
├── lib/
│   ├── components/           # Shared UI components
│   ├── server/
│   │   ├── api.ts            # Backend API client
│   │   └── thumbCache.ts     # Thumbnail caching
│   └── types.ts              # Shared TypeScript types
└── app.css                   # Global styles (Tailwind)
```

---

## License

[PolyForm Noncommercial](LICENSE)
