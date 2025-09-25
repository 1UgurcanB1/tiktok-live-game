# tiktok-live-game

## Overview

Monorepo (Turborepo) for a TikTok Live game stack.

- UI: React + Vite + Tailwind CSS (TypeScript)
- Server: Node.js + Express + WebSocket (TypeScript)
- Data: MongoDB (Mongoose)
- TikTok: tiktok-live-connector (real mode) + in-house simulator (sim mode)

Environments: `development`, `staging`, `production` with separate `.env.*` files for server and web.

Default TikTok username example: `telechubbiies` (configurable).

Core features:

- Real / Simulated TikTok event streaming (chat / gift / follow / share / like)
- In‑chat voting to select the next mini‑game (digits 0–5)
- Fair random game sampling (avoids picking recently played games)
- Weighted & fair selection utilities in `@tiktok/utils`
- Unique per‑game rule sets (Thai language)
- WebSocket broadcast with wildcard consumption on the client
- Safe simulator mock file resolution (prevents path traversal escapes)
- Zod‑validated environment config & graceful fallbacks

---

## Prerequisites

- Node.js 18+
- pnpm 9+
- Docker (optional for MongoDB via compose)

---

## Quick Start (Development)

```powershell
# 1) Install dependencies
pnpm install

# 2) Start MongoDB (optional, if you run it via Docker Compose)
docker compose up -d

# 3) Build everything via Turbo (resolves package build order)
pnpm -w run build

# 4) Run server + web (dev mode)
pnpm run dev:all
```

### URLs

- Web: <http://localhost:5173>
- Server: <http://localhost:3001>
- WebSocket Path: `/ws` (full `ws://localhost:3001/ws`)

---

## Environment Variables (Server)

Server loads `.env.<NODE_ENV>` automatically. Example `.env.development`:

```env
NODE_ENV=development
PORT=3001
WS_PATH=/ws
DATABASE_URL=mongodb://localhost:27017/tiktok_live_dev
TIKTOK_USERNAME=telechubbiies
TIKTOK_MODE=sim
```

Notes

- `TIKTOK_MODE`: `real` uses tiktok-live-connector, `sim` uses the built-in simulator
- You can override mock file paths for the simulator with:
  - `TIKTOK_SIM_CHAT_FILE`
  - `TIKTOK_SIM_NAMES_FILE`

Web uses Vite’s `.env.<mode>` in `apps/web` and should include `VITE_SERVER_HTTP_URL` and `VITE_SERVER_WS_URL` pointing to the server.

---

## Turbo Pipeline

We use Turbo to build packages in the correct order.

- Root scripts:
  - `pnpm -w run build` → runs build across all packages (`^build` order)
  - `pnpm -w run typecheck` → runs typecheck pipeline (reserved)
  - `pnpm -w run lint` → lint all packages

- Dev scripts:
  - `pnpm run dev:all` → starts DB (compose), builds via Turbo, runs server + web
  - `pnpm run dev:start` / `pnpm run dev:fast` → variants without compose

---

## TikTok Modes

Two modes are supported via the server:

- Real: uses `tiktok-live-connector`
- Sim: emits random events: chat, gift, follow, share, like

Configure default mode with `.env.<env>` on server:

```env
TIKTOK_MODE=sim
```

Or select per-connection via API:

```http
POST /api/tiktok/connect
Content-Type: application/json

{
  "username": "telechubbiies",
  "mode": "sim" // or "real"
}
```

### WebSocket Broadcasts

- `tiktok.status` — connection state
- `tiktok.chat` — chat messages
- `tiktok.gift` — gift events
- `tiktok.follow` — follow events
- `tiktok.share` — share events
- `tiktok.like` — like bursts (`likeCount`, `totalLikeCount`)

On the web, a wildcard event channel `tiktok.*` is emitted for easy logging/debugging.

Example (client side):

```ts
import { events } from "../services/ws";

events.on("tiktok.*", (ev) => console.log("[ANY]", ev));
```

---

## Simulator (Mock Files)

The simulator reads mock data from simple text files by default:

- `apps/server/mock/tiktok_chat_messages.txt` — one message per line
- `apps/server/mock/tiktok_names.txt` — one display name per line

Rules

- Lines starting with `#` are treated as comments and ignored
- Override per-machine with:
  - `TIKTOK_SIM_CHAT_FILE`
  - `TIKTOK_SIM_NAMES_FILE`
- The resolver order is: env override → default repo file → built-in fallback

Security & resilience:

- Env overrides must be relative and remain inside the server root; invalid paths are skipped with a warning.
- Each candidate file read is wrapped with contextual error logging (path + code + message) before falling back.
- If all sources fail, a small built‑in default set of names/messages keeps the simulator producing traffic.
- All event loops share a `running` flag and clear timers on `disconnect()`.

---

## Project Structure

```text
tiktok-live-game/
  apps/
    server/
      src/
        app.ts                 - Express app wiring (routes/middlewares)
        server.ts              - HTTP + WebSocket server bootstrap
        index.ts               - Entrypoint (starts server)
        env.ts                 - Zod-validated environment loader
        db.ts                  - Mongoose connection + health
        tiktok.ts              - Wrapper for tiktok-live-connector (real mode)
        controllers/
          health.controller.ts - Health/status endpoints
          tiktok.controller.ts - Connect/disconnect/status APIs
        routes/
          index.ts             - Route aggregator
          health.routes.ts
          tiktok.routes.ts
        services/
          tiktok.service.ts    - Mode switching service (real or simulated)
        middlewares/
          validate.ts          - zod validation middleware
        lib/
          ws.ts                - WebSocket server + broadcast helpers
        models/
          index.ts
          Leaderboard.ts
          Round.ts
          Score.ts
          Session.ts
      mock/
        tiktok_chat_messages.txt - Default chat messages
        tiktok_names.txt          - Default display names
      package.json
      tsconfig.json

    web/
      src/
        main.tsx
        App.tsx
        env.ts                   - Vite env accessors
        app/
          router.tsx             - App routes
          store/
            game.store.ts        - Client-side store
        components/
          ButtonMotion.tsx
          PageTransition.tsx
          SystemStatus.tsx
          TimedProgressBar.tsx
        hooks/
          useAutoAdvance.ts
          useBroadcast.ts
          useCountdown.ts
        pages/
          Home.tsx
          GameSelect.tsx
          Play.tsx
          RoundSummary.tsx
          Rules.tsx
          Scoreboard.tsx
          Support.tsx
          control/
            ControlHome.tsx
        services/
          api.ts                 - HTTP client
          ws.ts                  - Typed WebSocket client
        assets/
          ...
        styles/
          index.css, App.css     - Global styles
      vite.config.ts
      tsconfig.json
      tsconfig.app.json
      tsconfig.node.json
      tailwind.config.js
      eslint.config.js
      package.json

  packages/
    types/
      src/
        index.ts
        tiktok.ts               - Shared TikTok event types
        game.ts                 - Shared game types
        db.ts                   - Shared DB types
      package.json
      tsconfig.json
    constants/
      src/
        index.ts
        game.ts                 - Game definitions (uses shared types)
      package.json
      tsconfig.json
    utils/
      src/
        index.ts                - Shared utilities
        random.ts               - Sampling (fair / weighted)
      package.json
      tsconfig.json

  docker-compose.dev.yml
  docker-compose.staging.yml
  docker-compose.prod.yml
  turbo.json
  pnpm-workspace.yaml
  package.json
  tsconfig.base.json
  eslint.config.js
  README.md
  pnpm-lock.yaml
```

---

## Game Definitions & Selection

Game configs live in `packages/constants/src/game.ts` (typed by `GameConfig`). Each includes: stable `id`, `defaultRounds`, `defaultRoundDurationMs`, `category`, `description`, and `rules` (Thai).

| ID | Name | Rounds | Round ms | Category |
|----|------|--------|----------|----------|
| guessWordTH | ทายคำภาษาไทย | 10 | 40000 | guessWord |
| guessWordEN | ทายคำภาษาอังกฤษ | 10 | 40000 | guessWord |
| guessFlag | ทายภาพธงชาติ | 10 | 35000 | guessPicture |
| guessMottoTH | ทายคำขวัญจังหวัด | 8 | 45000 | guessWord |
| wordleTH | เกมเวิร์ดเดิลภาษาไทย | 6 | 55000 | wordle |
| wordleEN | เกมเวิร์ดเดิลภาษาอังกฤษ | 6 | 55000 | wordle |
| contextoTH | เกมคอนเท็กโตภาษาไทย | 8 | 50000 | contexto |
| davinciTH | เกมดาวินชีภาษาไทย | 10 | 45000 | davinci |
| memoryTest | ทดสอบความจำ | 10 | 35000 | memory |

### Voting Flow

1. During selection phase: 5 games sampled + option `0 = สุ่มเกม`.
2. Users vote by sending a single digit 0–5. Regex used: `VOTE_DIGIT_REGEX` (ignores digits embedded inside longer numbers).
3. Only a unique leader becomes highlighted; ties do not shift highlight (stability).
4. Timer end:

   - Tie → random among tied.
   - Winner 0 → random among 5 sampled.

5. Chosen game id appended to recent history (localStorage) feeding fair sampling.

### Fair Sampling

`fairSampleByKey(items, n, key, recent, window)`:

- Prefers items not in `recent` (window slice). If enough fresh items exist, pick only from them.
- Otherwise fill remaining slots from recents (still unique per call).
- Shuffling used to avoid deterministic ordering.

### Weighted Sampling

Utilities (`@tiktok/utils/random.ts`):

- `weightedPickBy(items, weight)` → single weighted random pick.
- `weightedSampleBy(items, n, weight, { replacement })` → top‑k sample w/out replacement via exponential race (Gumbel trick).

Both apply weight normalization (finite, >= min threshold) to avoid division by zero and Infinity keys.

---

## Troubleshooting

- If type changes aren’t reflected, run:
  - `pnpm -w run build` to rebuild the graph (types → consumers)
- No simulator events? Check console warnings for mock file resolution or ensure `TIKTOK_MODE=sim`.
- Voting digits misparsed? See `VOTE_DIGIT_REGEX` in `GameSelect.tsx`.
- Repeated games too often? Confirm `localStorage` not blocked; recent history drives fairness.
- Need deterministic tests for weighted sampling? Seed `Math.random` (wrapper) or refactor utilities to accept RNG injection.

---

## License

ISC

Copyright (c) 2025 Telechubbiies

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES ...
