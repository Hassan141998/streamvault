# 🚀 StreamVault v3 — Deploy Guide

## WHY THE BUILD FAILED
Your GitHub repo still has OLD files from session 1 (`components/HeroBanner.tsx`, `lib/tmdb.ts` without `tmdbImg` export, etc.)
The fix: **replace your entire repo** with the new clean project.

---

## STEP 1 — Create .env.local

Create a file called `.env.local` in your project folder:

```env
TMDB_API_KEY=892ee07655eef0dc884ff7311eb5b07b
DATABASE_URL=postgresql://neondb_owner:YOUR_NEW_NEON_PASSWORD@ep-lingering-tooth-airuin36-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=a7f3e92b1c45d68f0e23a1b4c7d9e02f5a8b3c6d9e1f4a7b0c3d6e9f2a5b8
NEXTAUTH_URL=http://localhost:3000
```

> ⚠️ Reset your Neon password first at neon.tech → Settings → Reset Password

---

## STEP 2 — Run DB Migration

1. Go to https://neon.tech → your project → **SQL Editor**
2. Open `DB_MIGRATION.sql` from this project
3. Copy ALL → Paste → Click **Run**
4. You should see 6 table names listed ✅

---

## STEP 3 — Test Locally

```powershell
cd E:\pycharm\streamvault
npm install
npm run dev
```
Open http://localhost:3000 — real movies! ✅

---

## STEP 4 — Fix GitHub (IMPORTANT: delete old repo first)

### 4a. Delete broken repo
1. Go to github.com/Hassan141998/streamvault
2. Settings → scroll to bottom → **Delete this repository**

### 4b. Create fresh empty repo
1. Go to https://github.com/new
2. Name: `streamvault` · Public · **NO readme, NO gitignore**
3. Click Create

### 4c. Push fresh code

```powershell
cd E:\pycharm\streamvault

# Delete old git
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

# Init fresh
git init
git add .
git status   # should show ~35 files, NO node_modules

git commit -m "StreamVault v3 - clean build"
git branch -M main
git remote add origin https://github.com/Hassan141998/streamvault.git
git push -u origin main
```

For password → use token from: https://github.com/settings/tokens/new (check `repo`)

---

## STEP 5 — Deploy on Vercel

1. Go to https://vercel.com → Add New Project → import `streamvault`
2. Framework = Next.js (auto) → Deploy (first deploy may fail)
3. Go to **Settings → Environment Variables** → Add:

| Name | Value |
|------|-------|
| `TMDB_API_KEY` | `892ee07655eef0dc884ff7311eb5b07b` |
| `DATABASE_URL` | your Neon connection string (new password) |
| `NEXTAUTH_SECRET` | `a7f3e92b1c45d68f0e23a1b4c7d9e02f5a8b3c6d9e1f4a7b0c3d6e9f2a5b8` |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` |

4. Deployments → Redeploy ✅

---

## STREAMING PLAYERS (6 servers built-in)

| Player | Best For | Dubbed? | Subtitles? |
|--------|----------|---------|------------|
| VidSrc | Best quality | ❌ | English ✓ |
| VidSrc 2 | Backup | ❌ | English ✓ |
| AutoEmbed | Multi-lang | ❌ | Arabic/French/Spanish ✓ |
| 2Embed | Subtitles | ❌ | SRT embedded ✓ |
| **Smashy** | **Hindi/Urdu dubbed** | **✓** | ✓ |
| MultiEmbed | Multiple audio | ✓ | ✓ |

> Use **Smashy** for Bollywood/Turkish in Hindi/Urdu. Switch players if one doesn't load.

---

## WHAT'S IN THIS PROJECT

```
streamvault/
├── pages/
│   ├── index.tsx          → Homepage (trending, bollywood, turkish, korean)
│   ├── movies.tsx          → Browse movies with genre filter
│   ├── series.tsx          → Browse TV with region filter
│   ├── dubbed.tsx          → Dubbed & Subtitled content
│   ├── search.tsx          → Live search
│   ├── downloads.tsx       → App download page
│   ├── movie/[id].tsx      → Movie detail + 6-player streamer
│   ├── tv/[id].tsx         → TV detail + season/episode picker + 6 players
│   ├── watch/[type]/[id]   → Full-screen watch mode
│   └── auth/signin|error   → Login/register
├── components/
│   ├── Navbar.tsx          → Fixed nav with live search autocomplete
│   ├── Hero.tsx            → Auto-rotating hero banner
│   ├── Card.tsx            → Movie card (Watch Now + Info buttons)
│   ├── Row.tsx             → Horizontal scrollable row
│   ├── Footer.tsx          → Footer with links
│   └── SetupBanner.tsx     → Warning when keys missing
├── lib/
│   ├── tmdb.ts             → TMDb API helpers
│   ├── auth.ts             → NextAuth config
│   └── db.ts               → Neon DB wrapper
└── DB_MIGRATION.sql        → Run once in Neon SQL Editor
```
