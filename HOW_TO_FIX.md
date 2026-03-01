# ✅ HOW TO FIX THE 404 & DATABASE ERRORS — Step by Step

## The Problem
Your `lib/auth.ts` crashes because it calls `neon()` before checking
if DATABASE_URL exists. These fixed files solve that permanently.

---

## STEP 1 — Replace the broken files

Copy ALL folders from this zip into your `streamvault` project folder.
**Overwrite/replace** existing files when asked.

Your folder structure should look like this after replacing:
```
streamvault/
├── lib/
│   ├── auth.ts         ← REPLACE (fixed version)
│   ├── db.ts           ← REPLACE (safe version)
│   └── tmdb.ts         ← REPLACE
├── pages/
│   ├── index.tsx       ← REPLACE
│   ├── search.tsx      ← REPLACE
│   ├── _app.tsx        ← REPLACE
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].ts  ← REPLACE
│   │   ├── register.ts           ← REPLACE
│   │   ├── watchlist.ts          ← REPLACE
│   │   └── history.ts            ← REPLACE
│   └── auth/
│       └── signin.tsx            ← REPLACE
└── components/
    ├── SetupBanner.tsx   ← NEW (add this file)
    ├── Navbar.tsx        ← REPLACE
    ├── HeroBanner.tsx    ← REPLACE
    ├── MovieCard.tsx     ← REPLACE
    ├── MovieRow.tsx      ← REPLACE
    ├── Footer.tsx        ← REPLACE
    ├── CountryFilter.tsx ← REPLACE
    ├── DownloadCTA.tsx   ← REPLACE
    └── TrailerModal.tsx  ← REPLACE
```

---

## STEP 2 — Create your .env.local file

1. Find the file called `env.local` in this zip
2. Copy it into your `streamvault` folder (same place as `package.json`)
3. Rename it to `.env.local` (add a dot at the start)
4. Open it and add your TMDB API key

### Get your FREE TMDb API key (2 minutes):
1. Go to → https://www.themoviedb.org/signup
2. Create account and verify email
3. Go to → https://www.themoviedb.org/settings/api
4. Click **Create** → choose **Developer** → fill form → Submit
5. Copy **"API Key (v3 auth)"**
6. Paste it in `.env.local`:
   ```
   TMDB_API_KEY=paste_your_key_here
   ```

---

## STEP 3 — Restart the server

In your terminal (inside the streamvault folder):

```
Ctrl+C      ← Stop the running server
npm run dev ← Start again
```

Open: http://localhost:3000

---

## What works WITHOUT any keys
- ✅ Homepage loads (with placeholder movie cards)
- ✅ Navigation works
- ✅ No crashes or 404 errors
- ❌ Real movie data (needs TMDB_API_KEY)
- ❌ Login / Sign up (needs DATABASE_URL)
- ❌ Watchlist / History (needs DATABASE_URL)

## What works WITH just TMDB_API_KEY
- ✅ Homepage with 100+ real movies
- ✅ Movie detail pages with posters, cast, trailers
- ✅ Search works
- ✅ All navigation
- ❌ Login / Sign up (needs DATABASE_URL)

## What works WITH both keys
- ✅ Everything above
- ✅ User registration and login
- ✅ My List / Watchlist
- ✅ Watch history

---

## Still seeing errors?

**"Cannot find module './db'"**
→ Make sure db.ts is in the `lib/` folder

**"Module not found: next-auth"**  
→ Run: `npm install` in your terminal

**Page still shows old error after replacing files**
→ Stop server (Ctrl+C) and run `npm run dev` again
→ Also try deleting the `.next` folder:
   Windows: `rmdir /s /q .next`
   Mac/Linux: `rm -rf .next`

**Sign in shows "demo mode"**
→ That's correct when DATABASE_URL is empty.
→ Test login: email `demo@streamvault.com` password `demo1234`
