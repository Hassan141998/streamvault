# StreamVault — Complete Deployment Guide

## ⚡ STEP 1: Set up .env.local (REQUIRED FIRST)

Create `.env.local` in your project root with these values:

```env
TMDB_API_KEY=892ee07655eef0dc884ff7311eb5b07b

# IMPORTANT: Reset your Neon password first, then paste new string here
DATABASE_URL=postgresql://neondb_owner:YOUR_NEW_PASSWORD@ep-lingering-tooth-airuin36-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require

NEXTAUTH_SECRET=a7f3e92b1c45d68f0e23a1b4c7d9e02f5a8b3c6d9e1f4a7b0c3d6e9
NEXTAUTH_URL=http://localhost:3000
```

---

## ⚡ STEP 2: Run Database Migration

1. Go to https://neon.tech → your project → **SQL Editor**
2. Open `DB_MIGRATION.sql` from this project
3. Copy ALL the SQL and paste it in Neon SQL Editor
4. Click **Run**
5. You should see 8 table names listed at the bottom ✅

---

## ⚡ STEP 3: Test Locally

```powershell
cd E:\pycharm\streamvault
npm install
npm run dev
```

Open http://localhost:3000 — you should see real movies! 🎬

---

## ⚡ STEP 4: Push to GitHub (CORRECT METHOD)

### 4a. Create fresh empty repo on GitHub
- Go to https://github.com/new
- Name: `streamvault`
- Public, NO readme, NO gitignore
- Click Create

### 4b. Run in PowerShell (from your project folder):

```powershell
cd E:\pycharm\streamvault

# Remove any broken git history
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

# Fresh start
git init
git add .

# Verify — should show ~40 files, NOT node_modules
git status

git commit -m "StreamVault v2 - complete"
git branch -M main
git remote add origin https://github.com/Hassan141998/streamvault.git
git push -u origin main
```

**When asked for password** → use a Personal Access Token:
- Go to https://github.com/settings/tokens/new
- Check `repo` scope → Generate → Copy token → paste as password

---

## ⚡ STEP 5: Deploy to Vercel

1. Go to https://vercel.com → Sign in with GitHub
2. Click **Add New Project** → Import `streamvault` repo
3. Framework = Next.js (auto-detected) → Click **Deploy**
4. Wait for first deploy (may fail — that's OK)

### 5a. Add Environment Variables in Vercel:

Go to: Vercel project → **Settings** → **Environment Variables**

Add these one by one:

| Name | Value |
|------|-------|
| `TMDB_API_KEY` | `892ee07655eef0dc884ff7311eb5b07b` |
| `DATABASE_URL` | your Neon connection string (with new password) |
| `NEXTAUTH_SECRET` | `a7f3e92b1c45d68f0e23a1b4c7d9e02f5a8b3c6d9e1f4a7b0c3d6e9` |
| `NEXTAUTH_URL` | `https://YOUR-PROJECT.vercel.app` |

### 5b. Get your Vercel URL:
Vercel project → Domains section → copy `https://streamvault-hassan141998.vercel.app`

### 5c. Redeploy:
Vercel → Deployments → three dots on latest → **Redeploy**

---

## ⚡ STEP 6: Security — Reset Neon Password

Since you shared credentials publicly:

1. Go to https://neon.tech → your project
2. Settings → **Reset password**
3. Copy new connection string
4. Update `DATABASE_URL` in:
   - Your local `.env.local`
   - Vercel Environment Variables → Redeploy

---

## ✅ What's Working After Setup

| Feature | Status |
|---------|--------|
| Homepage with trending movies | ✅ |
| Movie & TV detail pages | ✅ |
| YouTube trailers | ✅ |
| Free streaming via Vidsrc | ✅ |
| Live search with autocomplete | ✅ |
| User registration & login | ✅ |
| My List / Watchlist | ✅ |
| Bollywood, Turkish, French sections | ✅ |
| Download page | ✅ |
| Mobile responsive | ✅ |

---

## 🔧 Troubleshooting

| Error | Fix |
|-------|-----|
| `neon() no connection string` | Check DATABASE_URL in .env.local |
| `/auth/error 404` | Fixed in this version |
| `placeholder-poster 404` | Make sure public/ folder has images |
| Movies not loading | Check TMDB_API_KEY |
| Vercel build fails | Check all env vars are added in Vercel settings |
| Login fails on Vercel | Set NEXTAUTH_URL to your vercel domain |
