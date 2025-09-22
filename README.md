# tiktok-live-game

# Development
pnpm docker:dev

# Staging
pnpm docker:staging

# Production (local)
pnpm docker:prod

# ปิดและลบ volumes
Remove-Item -Recurse -Force .docker\dev -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .docker\staging -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .docker\prod -ErrorAction SilentlyContinue
pnpm docker:down

# และอย่าลืม build shared types ครั้งแรก/เวลาแก้ไฟล์ type:
pnpm --filter "@tiktok/types" build

ผูกทั้งหมดด้วย Turborepo
# เริ่มฐานข้อมูล dev ก่อน
pnpm docker:dev

# Build shared types
pnpm --filter @tiktok/types build

# รันพร้อมกันทั้ง server + web
pnpm dev




Monorepo (Turborepo) for a simple TikTok Live game stack:

- **UI**: React + Vite + Tailwind CSS (TypeScript)
- **Server**: Node.js + Express + WebSocket (TypeScript)
- **DB**: PostgreSQL 17 via Docker
- **Chat**: [tiktok-live-connector](https://www.npmjs.com/package/tiktok-live-connector)

Environments: `development`, `staging`, `production` with separate `.env.*` files for both **server** and **web**.

> Default TikTok username is set to `telechubbiies`.

---

## Prerequisites

- Node.js 18+
- pnpm 9+
- Docker & Docker Compose

---

## Quick Start (Development)

```bash
# 1) Start Postgres 17 (creates 3 DBs: tiktok_live, tiktok_live_stag, tiktok_live_dev)
docker compose up -d

# 2) Install deps

pnpm install

# 3) Run all apps
pnpm dev
```

อนุมัติสคริปต์ที่ถูกบล็อก (esbuild, protobufjs ฯลฯ)
pnpm approve-builds

ปัญหาTurborepo ต้องการฟิลด์ packageManager ใน package.json รันคำสั่งนี้
$ver = pnpm -v
pnpm pkg set packageManager="pnpm@$ver"

ปัญหาใน apps/web/vite.config.ts เรา import '@vitejs/plugin-react' แต่ยังไม่ได้ติดตั้งแพ็กเกจตัวนี้
pnpm --filter web add -D @vitejs/plugin-react

ปัญหาติดตั้ง @types/cors ฝั่ง server เป็น devDependency:
pnpm --filter server add -D @types/cors

ปัญหาติดตั้ง @types/pg ฝั่ง server เป็น devDependency:
pnpm --filter server add -D @types/pg

- Web will run at: http://localhost:5173
- Server will run at: http://localhost:4000
- WebSocket URL: ws://localhost:4000

The server loads `.env.development` automatically; the web app uses Vite's `.env.development`.

---

ติดตั้ง Library Dependency

ติดตั้งเฉพาะ web
# dependency ปกติ (runtime)
pnpm --filter web add some-lib

# devDependency (ใช้ตอน dev/build เท่านั้น)
pnpm --filter web add -D @vitejs/plugin-react

# เอาออก
pnpm --filter web remove some-lib

# อัปเดตเวอร์ชัน
pnpm --filter web up some-lib

ติดตั้งเฉพาะ server
# dependency ปกติ
pnpm --filter server add express ws

# devDependency (พวก type definitions)
pnpm --filter server add -D typescript @types/node @types/express

# เอาออก
pnpm --filter server remove ws

# อัปเดต
pnpm --filter server up express

---

## Staging / Production

You can reuse the same Docker Postgres locally and just switch environments:

**Server** (Windows-friendly via `cross-env`):
```bash
# Staging
pnpm --filter server build
pnpm --filter server cross-env NODE_ENV=staging node dist/index.js

# Production
pnpm --filter server build
pnpm --filter server cross-env NODE_ENV=production node dist/index.js
```

**Web**:
```bash
# Staging build uses .env.staging
pnpm --filter web build --mode staging
pnpm --filter web preview --host

# Production build uses .env.production
pnpm --filter web build --mode production
pnpm --filter web preview --host
```

> Adjust `VITE_SERVER_HTTP_URL` and `VITE_SERVER_WS_URL` in each web `.env.*` as needed.

---

## Project Structure

```
tiktok-live-game/
  apps/
    server/
      src/
      .env.development
      .env.staging
      .env.production
    web/
      src/
      .env.development
      .env.staging
      .env.production
  docker/
    initdb.d/
      01-create-dbs.sql
  turbo.json
  pnpm-workspace.yaml
  package.json
  tsconfig.base.json
  docker-compose.yml
```

---

## Notes

- No Prisma is used. DB access is via `pg`.
- The server broadcasts TikTok chat messages over websockets to the UI.
- Simple scoreboard demo (top chatters) is implemented client-side.
- Edit the TikTok username in `.env.*` (server and web) if needed.

---

ฉันจะสร้างเกมไว้เล่นกับผู้ชมในไลฟ์ Tiktok 
UI :React + Tailwind Plus 
Server: TypeScript + Node.js + Express + Websocket 
DB: Postgresql+ docker ฉันใช้ Postgresql 17 
docker ให้ติดตั้ง pgadmin มาด้วยนะ

อยากให้มีการแยก environment (.env)
development, staging, production
db:
tiktok_live สำหรับ prod
tiktok_live_stag สำหรับ staging 
tiktok_live_dev สำหรับ developemnt 

ไม่ต้องใช้ prisma

ดึงแชท live tiktok ด้วย https://www.npmjs.com/package/tiktok-live-connector 
tiktok username: telechubbiies

ฉันอยากให้ server กับ ui อยู่ในโปรเจ็คเดียวกัน 
ใช้ Turborepo ด้วย ช่วยเขียนโครงสร้างโปรเจ็ค 
ขอแบบเรียบง่าย ง่ายต่อการ coding และพร้อมวิธีติดตั้ง 

โปรเจ็คชื่อ tiktok-live-game
ส่งโปรเจ็คมาเป็น .zip ได้เลย

---

คุณช่วยฉันสร้างโปรเจค web app
UI :React(vite) + tailwindcss @tailwindcss/vite
Server: TypeScript + Node.js + Express + Websocket 
DB: Postgresql+ docker ฉันใช้ Postgresql 17 
docker ให้ติดตั้ง pgadmin มาด้วยนะ

code มี interface สำหรับ server web และใช้ร่วมกันด้วยนะ

อยากให้มีการแยก environment (.env)
development, staging, production
db:
tiktok_live สำหรับ prod
tiktok_live_staging สำหรับ staging 
tiktok_live_dev สำหรับ developemnt 

ฉันอยากให้ server กับ ui อยู่ในโปรเจ็คเดียวกัน 
ใช้ Turborepo ด้วย

คุณช่วยฉันสร้างโปรเจ็คทีละขั้นตอน
ค่อย ๆ install dependecy/library ไปทีละตัว เป้นลำดับขั้นตอนไป