# 🚀 StreamVault — Complete Setup & Deployment Guide
### From Zero to Live in ~45 Minutes

---

## 📁 Project Structure

```
streamvault/
├── components/
│   ├── Navbar.tsx          ← Top navigation + live search
│   ├── HeroBanner.tsx      ← Auto-playing hero carousel
│   ├── MovieCard.tsx       ← Hoverable movie poster card
│   ├── MovieRow.tsx        ← Horizontal scrollable row
│   ├── CountryFilter.tsx   ← Hollywood/Bollywood/etc filter
│   ├── TrailerModal.tsx    ← YouTube trailer popup
│   ├── DownloadCTA.tsx     ← App download banner
│   └── Footer.tsx          ← Full 5-column footer
├── lib/
│   ├── db.ts               ← Neon DB schema + Drizzle ORM
│   ├── tmdb.ts             ← All TMDb API calls
│   └── auth.ts             ← NextAuth.js config
├── pages/
│   ├── _app.tsx            ← App wrapper + session
│   ├── _document.tsx       ← HTML document
│   ├── index.tsx           ← Home page (live TMDb data)
│   ├── search.tsx          ← Search page
│   ├── movie/[id].tsx      ← Movie detail page
│   ├── tv/[id].tsx         ← TV show detail page
│   └── api/
│       ├── auth/[...nextauth].ts   ← Auth routes
│       ├── tmdb/[...slug].ts       ← TMDb proxy
│       ├── register.ts             ← User registration
│       ├── watchlist.ts            ← My List API
│       └── history.ts              ← Watch history API
├── styles/
│   └── globals.css         ← Brand tokens + animations
├── .env.example            ← Environment template
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## STEP 1 — Get Your API Keys (All Free)

### 🎬 1A. TMDb API Key (REQUIRED — Movie Data & Images)
**Website:** https://www.themoviedb.org

1. Go to https://www.themoviedb.org/signup
2. Create a free account and verify your email
3. Go to: https://www.themoviedb.org/settings/api
4. Click **"Create"** → choose **Developer**
5. Fill in the form (put "Personal Project" for everything)
6. Copy your **API Key (v3 auth)** → paste in `.env.local` as `TMDB_API_KEY`
7. Also copy **API Read Access Token** → paste as `TMDB_READ_ACCESS_TOKEN`

**What you get FREE:**
- 10,000+ requests/day
- 1M+ movies and TV shows database
- Posters, backdrops, cast photos
- Trailers (YouTube links)
- Ratings, genres, descriptions, cast

**TMDb API Docs:** https://developer.themoviedb.org/docs/getting-started

---

### 🗄️ 1B. Neon Database (REQUIRED — Users, Watchlists, History)
**Website:** https://neon.tech

1. Go to https://neon.tech and sign up (free with GitHub)
2. Click **"New Project"**
3. Name it `streamvault`, choose region closest to you
4. Once created, go to **Connection Details**
5. Copy the **Connection String** (looks like `postgresql://user:pass@host/dbname`)
6. Paste as `DATABASE_URL` in `.env.local`
7. Click **SQL Editor** in the Neon dashboard
8. Paste the entire SQL from `lib/db.ts` → `MIGRATION_SQL` (lines at the bottom of that file)
9. Click **Run** — this creates all your tables

**Free tier:** 512MB storage, 1 project, unlimited queries

**Neon Docs:** https://neon.tech/docs

---

### 🔐 1C. Google OAuth (OPTIONAL — "Sign in with Google")
**Website:** https://console.cloud.google.com

1. Go to https://console.cloud.google.com
2. Create a new project called `StreamVault`
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client IDs**
5. Application type: **Web application**
6. Authorized redirect URIs — add these:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-app.vercel.app/api/auth/callback/google` (add after deploying)
7. Copy **Client ID** → `GOOGLE_CLIENT_ID`
8. Copy **Client Secret** → `GOOGLE_CLIENT_SECRET`

---

### 🔑 1D. Generate NextAuth Secret
Open your terminal and run:
```bash
openssl rand -base64 32
```
Copy the output → paste as `NEXTAUTH_SECRET` in `.env.local`

---

## STEP 2 — Local Development Setup

```bash
# 1. Download/clone the project
cd streamvault

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Then open .env.local and fill in ALL the values from Step 1

# 4. Run development server
npm run dev

# 5. Open in browser
# → http://localhost:3000
```

Your site is now running locally with LIVE movie data from TMDb! 🎉

---

## STEP 3 — Deploy to Vercel (Free Hosting)

### 3A. Push to GitHub
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial StreamVault commit"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/streamvault.git
git push -u origin main
```

### 3B. Deploy on Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Select your `streamvault` repository
4. Vercel auto-detects Next.js — click **Deploy**
5. After deploy finishes, go to **Settings → Environment Variables**
6. Add ALL variables from your `.env.local` file:

| Variable | Value |
|----------|-------|
| `TMDB_API_KEY` | your-tmdb-key |
| `DATABASE_URL` | postgresql://...neon.tech/... |
| `NEXTAUTH_SECRET` | your-generated-secret |
| `NEXTAUTH_URL` | https://your-app.vercel.app |
| `GOOGLE_CLIENT_ID` | xxx.apps.googleusercontent.com |
| `GOOGLE_CLIENT_SECRET` | your-secret |
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxx.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your-key |

7. Go to **Deployments → Redeploy** after adding env vars
8. Your site is live at `https://your-app.vercel.app` 🚀

### 3C. Add Custom Domain (Optional, Free)
1. In Vercel project → **Settings → Domains**
2. Add your domain (e.g., `streamvault.pk`)
3. Update your DNS with the CNAME Vercel provides
4. SSL certificate is automatic and free

---

## STEP 4 — Add More Content Sources

### 4A. Supabase Storage (Upload Your Own Posters)
**Website:** https://supabase.com

1. Sign up free at https://supabase.com
2. Create project `streamvault`
3. Go to **Storage → Create bucket** named `posters`
4. Make it public
5. Copy URL and anon key to `.env.local`

### 4B. YouTube Data API (Trailer Search)
**Website:** https://console.cloud.google.com

1. In your Google Cloud project → **APIs & Services**
2. Enable **YouTube Data API v3**
3. Create an API key
4. Paste as `YOUTUBE_API_KEY`
5. Use it to search trailers: `https://www.googleapis.com/youtube/v3/search?q=Inception+trailer&type=video&key=YOUR_KEY`

---

## STEP 5 — Neon Database: Run Migration

Go to https://neon.tech → your project → **SQL Editor** and run:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255) NOT NULL UNIQUE,
  email_verified TIMESTAMPTZ,
  image TEXT,
  password TEXT,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE TABLE IF NOT EXISTS watchlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tmdb_id INTEGER NOT NULL,
  media_type VARCHAR(10) NOT NULL,
  title TEXT,
  poster TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tmdb_id INTEGER NOT NULL,
  media_type VARCHAR(10) NOT NULL,
  title TEXT,
  poster TEXT,
  progress REAL DEFAULT 0,
  season INTEGER,
  episode INTEGER,
  watched_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ratings (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tmdb_id INTEGER NOT NULL,
  media_type VARCHAR(10) NOT NULL,
  rating REAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, tmdb_id, media_type)
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tmdb_id INTEGER NOT NULL,
  media_type VARCHAR(10) NOT NULL,
  body TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## API Quick Reference

### TMDb Endpoints Used In This Project

| Page | API Call | URL |
|------|----------|-----|
| Homepage hero | Trending all | `/api/tmdb/trending/all/week` |
| Trending row | Trending movies | `/api/tmdb/trending/movie/week` |
| Top rated | Top rated movies | `/api/tmdb/movie/top_rated` |
| New releases | Now playing | `/api/tmdb/movie/now_playing` |
| Bollywood | Discover by country | `/api/tmdb/discover/movie?with_origin_country=IN` |
| Turkish | Discover TV by country | `/api/tmdb/discover/tv?with_origin_country=TR` |
| Movie detail | Movie + credits + videos | `/api/tmdb/movie/ID?append_to_response=credits,videos,similar` |
| TV detail | TV + seasons | `/api/tmdb/tv/ID?append_to_response=credits,videos,similar` |
| Search | Multi search | `/api/tmdb/search/multi?query=TERM` |

### Your Own API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/register` | POST | Create new user account |
| `/api/watchlist` | GET/POST/DELETE | Manage My List |
| `/api/history` | GET/POST | Watch history & progress |
| `/api/auth/signin` | POST | Sign in with credentials |
| `/api/auth/callback/google` | GET | Google OAuth callback |

---

## 💰 Free Tier Limits Summary

| Service | Free Limit | Upgrade Cost |
|---------|-----------|-------------|
| TMDb API | 10,000 req/day | Free forever |
| Neon Database | 512MB, 1 project | $19/mo |
| Vercel Hosting | 100GB bandwidth/mo | $20/mo |
| Supabase Storage | 1GB | $25/mo |
| Google OAuth | Unlimited | Free |
| YouTube API | 10,000 units/day | $0.05/1000 |

**For a new site with <1,000 daily users: everything runs 100% FREE.**

---

## 🔑 Important Links

| Resource | URL |
|----------|-----|
| TMDb Signup | https://www.themoviedb.org/signup |
| TMDb API Settings | https://www.themoviedb.org/settings/api |
| TMDb API Docs | https://developer.themoviedb.org/docs |
| TMDb Movie IDs | https://www.themoviedb.org/movie/TOP — ID is in the URL |
| Neon Signup | https://neon.tech |
| Neon Docs | https://neon.tech/docs/introduction |
| Vercel Signup | https://vercel.com/signup |
| Vercel Docs | https://vercel.com/docs |
| Supabase Signup | https://supabase.com |
| Google Cloud Console | https://console.cloud.google.com |
| NextAuth.js Docs | https://next-auth.js.org |

---

## 🐛 Common Issues & Fixes

**"TMDB_API_KEY is not set"**
→ Make sure `.env.local` exists and has the key. Restart `npm run dev`.

**"Database connection failed"**
→ Check your `DATABASE_URL` includes `?sslmode=require` at the end.

**"Google sign-in not working"**
→ Make sure your redirect URI in Google Cloud matches exactly, including protocol.

**Images not loading**
→ Check `next.config.js` has `image.tmdb.org` in `remotePatterns`.

**"Module not found"**
→ Run `npm install` again. Make sure all files are in the right folders.

**Vercel build fails**
→ Check the build logs. Usually a missing env variable — add it in Vercel dashboard.

---

## ✅ Launch Checklist

- [ ] TMDb API key added to .env.local
- [ ] Neon DATABASE_URL added to .env.local
- [ ] SQL migration run in Neon SQL Editor
- [ ] `npm run dev` works locally with real movies showing
- [ ] Google OAuth credentials added (optional)
- [ ] NEXTAUTH_SECRET generated and added
- [ ] GitHub repo created and code pushed
- [ ] Vercel project created and connected to GitHub
- [ ] All env vars added to Vercel dashboard
- [ ] NEXTAUTH_URL updated to your Vercel domain
- [ ] Google OAuth redirect URI updated with Vercel domain
- [ ] Custom domain added (optional)
- [ ] Test sign up, sign in, search, watchlist

---

*StreamVault · Built with Next.js 14, Neon PostgreSQL, TMDb API, NextAuth.js, Vercel*
