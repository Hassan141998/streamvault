# ✅ STREAMVAULT — COMPLETE SETUP GUIDE
### From broken → fully working with live movies, GitHub, Vercel, and Neon DB

---

## PART 1 — Fix Local Errors (Do This First)

### Step 1: Replace your project files

Delete everything in your current `streamvault` folder EXCEPT:
- `node_modules/` folder (keep it, saves time)
- `.next/` folder (keep or delete, doesn't matter)

Then copy ALL files from this ZIP into your `streamvault` folder.

### Step 2: Create .env.local file

In your `streamvault` folder (same place as `package.json`), create a new file called exactly:
```
.env.local
```

⚠️ Windows won't let you create a file starting with a dot normally.
Do this in PowerShell instead:
```powershell
cd E:\pycharm\streamvault
New-Item -Name ".env.local" -ItemType "file"
```

Then open it in VS Code or Notepad and paste this:
```
TMDB_API_KEY=REPLACE_THIS
DATABASE_URL=
NEXTAUTH_SECRET=streamvault-change-me-in-production
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Step 3: Get your TMDB API key (FREE, 3 minutes)

1. Open: https://www.themoviedb.org/signup
2. Create account → verify your email
3. Go to: https://www.themoviedb.org/settings/api
4. Click **"Create"** → choose **Developer**
5. Fill form (use "Personal Project" / "Learning" for all fields)
6. Click Submit
7. Copy the **"API Key (v3 auth)"** — looks like: `abc123def456...`
8. In .env.local replace `REPLACE_THIS` with your key:
   ```
   TMDB_API_KEY=abc123def456youractualkey
   ```

### Step 4: Stop and restart server

In PowerShell:
```powershell
# Press Ctrl+C to stop the running server, then:
npm run dev
```

Open http://localhost:3000 — you should now see real movies! 🎉

---

## PART 2 — Set Up Neon Database (for Login & Watchlist)

### Step 1: Create Neon Account

1. Go to: https://neon.tech
2. Click "Sign Up" — use GitHub login (easiest)
3. Click **"New Project"**
4. Name: `streamvault`
5. Region: choose closest to you (e.g. AWS US East)
6. Click **Create Project**

### Step 2: Get your connection string

1. In your Neon project dashboard, click **"Connection Details"**
2. Under "Connection string", copy the full string — looks like:
   ```
   postgresql://alex:AbCdEf123@ep-cool-name-123456.us-east-2.aws.neon.tech/streamvault?sslmode=require
   ```
3. In your .env.local, paste it as DATABASE_URL:
   ```
   DATABASE_URL=postgresql://alex:AbCdEf123@ep-cool-name-123456.us-east-2.aws.neon.tech/streamvault?sslmode=require
   ```

### Step 3: Run the database migration

1. In Neon dashboard, click **"SQL Editor"** (left sidebar)
2. Paste this entire SQL and click **"Run"**:

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
  type TEXT NOT NULL, provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT, access_token TEXT, expires_at INTEGER,
  token_type TEXT, scope TEXT, id_token TEXT, session_state TEXT
);
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL, token TEXT NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);
CREATE TABLE IF NOT EXISTS watchlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tmdb_id INTEGER NOT NULL, media_type VARCHAR(10) NOT NULL,
  title TEXT, poster TEXT, added_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tmdb_id INTEGER NOT NULL, media_type VARCHAR(10) NOT NULL,
  title TEXT, poster TEXT, progress REAL DEFAULT 0,
  season INTEGER, episode INTEGER, watched_at TIMESTAMPTZ DEFAULT NOW()
);
```

3. You should see "Success. 7 rows affected." or similar.

### Step 4: Restart server

```powershell
# Ctrl+C then:
npm run dev
```

Now sign up at http://localhost:3000/auth/signin — real accounts created in Neon!

---

## PART 3 — Push to GitHub

### Step 1: Create GitHub repository

1. Go to: https://github.com/Hassan141998
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `streamvault`
4. Keep it **Public** (needed for free Vercel)
5. Do NOT add README (we have our own files)
6. Click **"Create repository"**

### Step 2: Initialize Git in your project

In PowerShell (inside your streamvault folder):
```powershell
cd E:\pycharm\streamvault

# Initialize git
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial StreamVault commit"

# Connect to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/Hassan141998/streamvault.git

# Push to GitHub
git branch -M main
git push -u origin main
```

If it asks for GitHub login:
- Username: `Hassan141998`
- Password: use a **Personal Access Token** (not your GitHub password)
  - Go to: https://github.com/settings/tokens
  - Generate new token → check `repo` scope → copy it → use as password

### Step 3: Verify

Go to https://github.com/Hassan141998/streamvault — your code should be there!

---

## PART 4 — Deploy to Vercel (Free Hosting)

### Step 1: Connect Vercel to GitHub

1. Go to: https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel

### Step 2: Import your project

1. In Vercel dashboard, click **"Add New Project"**
2. Find `streamvault` in your repo list → click **"Import"**
3. Framework is auto-detected as **Next.js** ✓
4. Click **"Deploy"** — wait ~2 minutes

### Step 3: Add Environment Variables (CRITICAL!)

After first deploy (even if it fails):
1. Go to your Vercel project → **Settings** tab → **Environment Variables**
2. Add each variable one by one:

| Name | Value |
|------|-------|
| `TMDB_API_KEY` | your tmdb key |
| `DATABASE_URL` | your neon connection string |
| `NEXTAUTH_SECRET` | any long random string (min 32 chars) |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` |

To get NEXTAUTH_URL: go to Vercel → your project → copy the URL shown (e.g. `https://streamvault-hassan141998.vercel.app`)

Generate a strong NEXTAUTH_SECRET in PowerShell:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Redeploy

1. Vercel project → **Deployments** tab
2. Click the three dots on latest deployment → **"Redeploy"**
3. Wait ~2 min → your site is live! 🚀

---

## PART 5 — What You Need to Show Movies (Full Feature List)

### ✅ Already working with just TMDB_API_KEY:
- 🎬 Homepage with trending, top rated, now playing movies
- 🔍 Live search with autocomplete
- 🎭 Full movie & TV detail pages (cast, genres, runtime)
- 🎞️ YouTube trailer links
- 🌍 Bollywood, Turkish, French sections
- 📱 Responsive design

### 🔐 Needs DATABASE_URL (Neon):
- ✅ User registration & login
- ✅ My List / Watchlist
- ✅ Watch history

### 🎬 To Actually STREAM Movies (requires extra work):

Option A — **Link to free streaming sites** (simplest):
- Use TMDb's watch provider API to show where a movie streams legally
- API: `/movie/{id}/watch/providers` → returns Netflix, Prime, etc. links
- Add a "Where to Watch" section on movie detail page

Option B — **Embed Vidsrc** (no license needed for personal projects):
- Vidsrc provides embeddable free players for most movies
- URL format: `https://vidsrc.to/embed/movie/{TMDB_ID}`
- For TV: `https://vidsrc.to/embed/tv/{TMDB_ID}/{season}/{episode}`
- Add an iframe to your movie detail page with this URL
- ⚠️ Only for personal/demo use — not for commercial sites

Option C — **YouTube Trailers** (already built):
- Already working — "Watch Trailer" button links to YouTube

### 🖼️ To Show Movie Banners/Posters:
Already done! All images come from TMDb automatically once TMDB_API_KEY is set.
- Posters: `https://image.tmdb.org/t/p/w342{poster_path}`
- Backdrops: `https://image.tmdb.org/t/p/w1280{backdrop_path}`
- No extra setup needed.

---

## Summary: Minimum Required to Go Live

```
1. TMDB_API_KEY  → Real movies, posters, backdrops (free, 3 min)
2. DATABASE_URL  → Login, watchlist (free Neon, 5 min)
3. NEXTAUTH_SECRET → Any random 32+ char string
4. NEXTAUTH_URL  → Your Vercel URL
5. Push to GitHub + deploy on Vercel
```

That's it. Total setup time: ~20 minutes.

---

## Quick Troubleshooting

| Error | Fix |
|-------|-----|
| `TMDB_API_KEY not set` | Add to .env.local, restart server |
| `placeholder-poster.jpg 404` | Make sure public/ folder has the images |
| `/auth/error 404` | pages/auth/error.tsx now exists in this version |
| `Cannot find module` | Run `npm install` |
| `neon() no connection string` | Add DATABASE_URL to .env.local |
| Vercel deploy fails | Check Environment Variables in Vercel settings |
| Login not working on Vercel | Set NEXTAUTH_URL to your Vercel domain |

---

*StreamVault v2 — Next.js 14 · Neon PostgreSQL · TMDb API · Vercel*
