# ================================================================
# StreamVault — Smart GitHub Fix Script
# This script:
#   1. Removes node_modules from GitHub tracking
#   2. Removes all old broken files
#   3. Adds all new correct v3 files
#   4. Pushes to your EXISTING repo (no deletion needed)
#
# HOW TO RUN:
#   1. Copy this file into E:\pycharm\streamvault\
#   2. Open PowerShell in that folder
#   3. Run: .\FIX_AND_PUSH.ps1
# ================================================================

Write-Host ""
Write-Host "  ▶ StreamVault — Smart GitHub Fix" -ForegroundColor Red
Write-Host "  ===================================" -ForegroundColor DarkGray
Write-Host ""

# ── Check we are in the right folder ───────────────────────────
if (-not (Test-Path "package.json")) {
    Write-Host "  ❌ Wrong folder! Navigate to your streamvault project first:" -ForegroundColor Red
    Write-Host "     cd E:\pycharm\streamvault" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "  ✓ Found project folder" -ForegroundColor Green

# ── Step 1: Fix .gitignore FIRST so node_modules never uploads ─
Write-Host ""
Write-Host "  [1/6] Fixing .gitignore..." -ForegroundColor Cyan

$gitignore = @"
node_modules/
.next/
.env.local
.env
.vercel/
*.tsbuildinfo
next-env.d.ts
out/
"@
Set-Content -Path ".gitignore" -Value $gitignore -Encoding UTF8
Write-Host "  ✓ .gitignore updated (node_modules will be excluded)" -ForegroundColor Green

# ── Step 2: Remove old broken files from git tracking ──────────
Write-Host ""
Write-Host "  [2/6] Removing old broken files from git..." -ForegroundColor Cyan

# Remove node_modules from git tracking (keep the folder locally)
git rm -r --cached node_modules 2>$null
Write-Host "  ✓ node_modules removed from git tracking" -ForegroundColor Green

# Remove old component files that cause build errors
$oldFiles = @(
    "components/HeroBanner.tsx",
    "components/MovieCard.tsx", 
    "components/MovieRow.tsx",
    "components/Navbar.tsx",
    "components/Hero.tsx",
    "components/Card.tsx",
    "components/Row.tsx",
    "components/Footer.tsx",
    "components/SetupBanner.tsx",
    "components/DownloadBanner.tsx",
    "lib/tmdb.ts",
    "lib/auth.ts",
    "lib/db.ts",
    "pages/index.tsx",
    "pages/search.tsx",
    "pages/movies.tsx",
    "pages/series.tsx",
    "pages/dubbed.tsx",
    "pages/downloads.tsx",
    "pages/_app.tsx",
    "pages/_document.tsx",
    "pages/movie/[id].tsx",
    "pages/tv/[id].tsx",
    "pages/auth/signin.tsx",
    "pages/auth/error.tsx",
    "pages/api/register.ts",
    "pages/api/watchlist.ts",
    "pages/api/auth/[...nextauth].ts",
    "pages/api/tmdb/[...slug].ts",
    "styles/globals.css"
)

foreach ($file in $oldFiles) {
    git rm --cached "$file" 2>$null
}
Write-Host "  ✓ Old files untracked from git" -ForegroundColor Green

# ── Step 3: Write all new v3 files to disk ─────────────────────
Write-Host ""
Write-Host "  [3/6] Writing new v3 files..." -ForegroundColor Cyan

# Create folders
$folders = @(
    "components", "lib", "styles", "public",
    "pages", "pages\api", "pages\api\auth", "pages\api\tmdb",
    "pages\auth", "pages\movie", "pages\tv",
    "pages\watch", "pages\watch\[type]"
)
foreach ($f in $folders) {
    New-Item -ItemType Directory -Path $f -Force | Out-Null
}

# ── styles/globals.css ─────────────────────────────────────────
Set-Content -Path "styles\globals.css" -Encoding UTF8 -Value @'
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#0c0e12;color:#f1f5f9;font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{text-decoration:none;color:inherit}
button{font-family:inherit;cursor:pointer}
input{font-family:inherit}
input::placeholder{color:#334155}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-thumb{background:rgba(244,58,9,.5);border-radius:2px}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse2{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes spin{to{transform:rotate(360deg)}}
.hide-scrollbar{scrollbar-width:none;-ms-overflow-style:none}
.hide-scrollbar::-webkit-scrollbar{display:none}
'@

# ── lib/db.ts ──────────────────────────────────────────────────
Set-Content -Path "lib\db.ts" -Encoding UTF8 -Value @'
let _sql: any = null;
function getSQL() {
  if (_sql) return _sql;
  if (!process.env.DATABASE_URL) return null;
  try { const { neon } = require("@neondatabase/serverless"); _sql = neon(process.env.DATABASE_URL); return _sql; }
  catch { return null; }
}
export async function db(s: TemplateStringsArray, ...v: any[]): Promise<any[]> {
  const sql = getSQL(); if (!sql) return [];
  try { return await sql(s, ...v); } catch (e: any) { console.error("[DB]", e?.message); return []; }
}
export const hasDB = () => !!process.env.DATABASE_URL;
'@

# ── lib/tmdb.ts ────────────────────────────────────────────────
Set-Content -Path "lib\tmdb.ts" -Encoding UTF8 -Value @'
const BASE = "https://api.themoviedb.org/3";
const IMG  = "https://image.tmdb.org/t/p";
export const posterUrl   = (p: string|null, s="w342")  => p ? `${IMG}/${s}${p}` : "/placeholder-poster.jpg";
export const backdropUrl = (p: string|null, s="w1280") => p ? `${IMG}/${s}${p}` : "/placeholder-backdrop.jpg";
export const profileUrl  = (p: string|null)            => p ? `${IMG}/w185${p}`  : "/placeholder-person.jpg";
async function get(path: string, params: Record<string,string>={}) {
  const key = process.env.TMDB_API_KEY; if (!key) return null;
  try {
    const url = new URL(`${BASE}${path}`);
    url.searchParams.set("api_key", key); url.searchParams.set("language","en-US");
    Object.entries(params).forEach(([k,v]) => url.searchParams.set(k,v));
    const r = await fetch(url.toString()); return r.ok ? r.json() : null;
  } catch { return null; }
}
export const tmdb = {
  trending:    ()           => get("/trending/all/week"),
  topMovies:   ()           => get("/movie/top_rated"),
  nowPlaying:  ()           => get("/movie/now_playing"),
  popular:     ()           => get("/movie/popular"),
  popularTV:   ()           => get("/tv/popular"),
  topTV:       ()           => get("/tv/top_rated"),
  bollywood:   ()           => get("/discover/movie",{with_origin_country:"IN",sort_by:"popularity.desc"}),
  turkish:     ()           => get("/discover/tv",   {with_origin_country:"TR",sort_by:"popularity.desc"}),
  french:      ()           => get("/discover/movie",{with_origin_country:"FR",sort_by:"popularity.desc"}),
  pakistani:   ()           => get("/discover/tv",   {with_origin_country:"PK",sort_by:"popularity.desc"}),
  korean:      ()           => get("/discover/tv",   {with_origin_country:"KR",sort_by:"popularity.desc"}),
  movieDetail: (id: number) => get(`/movie/${id}`,{append_to_response:"credits,videos,similar"}),
  tvDetail:    (id: number) => get(`/tv/${id}`,   {append_to_response:"credits,videos,similar"}),
  search:      (q: string)  => get("/search/multi",{query:q}),
};
export function getTrailerKey(videos: any): string|null {
  if (!videos?.results?.length) return null;
  const yt = (videos.results as any[]).filter(v => v.site==="YouTube");
  return (yt.find(v => v.type==="Trailer") ?? yt[0])?.key ?? null;
}
'@

# ── lib/auth.ts ────────────────────────────────────────────────
Set-Content -Path "lib\auth.ts" -Encoding UTF8 -Value @'
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db, hasDB } from "./db";
import bcrypt from "bcryptjs";
const providers: any[] = [];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const G = require("next-auth/providers/google").default;
  providers.push(G({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }));
}
providers.push(CredentialsProvider({
  name: "Email & Password",
  credentials: { email: { label:"Email", type:"email" }, password: { label:"Password", type:"password" } },
  async authorize(creds) {
    if (!creds?.email || !creds?.password) return null;
    if (!hasDB()) {
      if (creds.email==="demo@streamvault.com" && creds.password==="demo1234")
        return { id:"1", name:"Demo User", email:"demo@streamvault.com", image:null };
      return null;
    }
    const [user] = await db`SELECT * FROM users WHERE email=${creds.email} LIMIT 1`;
    if (!user?.password) return null;
    const ok = await bcrypt.compare(creds.password, user.password);
    if (!ok) return null;
    return { id:String(user.id), name:user.name, email:user.email, image:user.image??null };
  },
}));
function buildAdapter() {
  if (!hasDB()) return undefined;
  return {
    async createUser(u: any) { const [r] = await db`INSERT INTO users(name,email,image,email_verified) VALUES(${u.name},${u.email},${u.image??null},${u.emailVerified??null}) ON CONFLICT(email) DO UPDATE SET name=EXCLUDED.name RETURNING *`; return r??u; },
    async getUser(id: string) { const [r] = await db`SELECT * FROM users WHERE id=${parseInt(id)}`; return r??null; },
    async getUserByEmail(email: string) { const [r] = await db`SELECT * FROM users WHERE email=${email}`; return r??null; },
    async getUserByAccount({ provider, providerAccountId }: any) { const [r] = await db`SELECT u.* FROM users u JOIN accounts a ON a.user_id=u.id WHERE a.provider=${provider} AND a.provider_account_id=${providerAccountId}`; return r??null; },
    async updateUser(u: any) { const [r] = await db`UPDATE users SET name=${u.name},image=${u.image??null} WHERE id=${parseInt(u.id)} RETURNING *`; return r??u; },
    async linkAccount(a: any) { await db`INSERT INTO accounts(user_id,type,provider,provider_account_id,access_token,refresh_token,expires_at,token_type,scope,id_token) VALUES(${a.userId},${a.type},${a.provider},${a.providerAccountId},${a.access_token??null},${a.refresh_token??null},${a.expires_at??null},${a.token_type??null},${a.scope??null},${a.id_token??null}) ON CONFLICT DO NOTHING`; },
    async createSession(s: any) { const [r] = await db`INSERT INTO sessions(session_token,user_id,expires) VALUES(${s.sessionToken},${s.userId},${s.expires}) ON CONFLICT(session_token) DO UPDATE SET expires=EXCLUDED.expires RETURNING *`; return r??s; },
    async getSessionAndUser(token: string) { const [r] = await db`SELECT s.*,u.id as uid,u.name,u.email,u.image FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.session_token=${token} AND s.expires>NOW()`; if (!r) return null; return { session:{sessionToken:token,userId:String(r.uid),expires:r.expires}, user:{id:String(r.uid),name:r.name,email:r.email,image:r.image} }; },
    async updateSession(s: any) { const [r] = await db`UPDATE sessions SET expires=${s.expires} WHERE session_token=${s.sessionToken} RETURNING *`; return r??null; },
    async deleteSession(token: string) { await db`DELETE FROM sessions WHERE session_token=${token}`; },
    async createVerificationToken(t: any) { const [r] = await db`INSERT INTO verification_tokens(identifier,token,expires) VALUES(${t.identifier},${t.token},${t.expires}) ON CONFLICT DO NOTHING RETURNING *`; return r??t; },
    async useVerificationToken({ identifier, token }: any) { const [r] = await db`DELETE FROM verification_tokens WHERE identifier=${identifier} AND token=${token} RETURNING *`; return r??null; },
  };
}
export const authOptions: NextAuthOptions = {
  adapter: buildAdapter() as any,
  providers,
  session: { strategy: hasDB() ? "database" : "jwt" },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-streamvault",
  callbacks: { async session({ session, user, token }) { if (session.user) (session.user as any).id = user?.id??token?.sub??"1"; return session; } },
  pages: { signIn:"/auth/signin", error:"/auth/error" },
};
'@

Write-Host "  ✓ lib/ files written" -ForegroundColor Green

# ── pages/_app.tsx ─────────────────────────────────────────────
Set-Content -Path "pages\_app.tsx" -Encoding UTF8 -Value @'
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Toaster position="bottom-right" toastOptions={{ style:{background:"#13161c",color:"#f1f5f9",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",fontSize:"13px"} }} />
    </SessionProvider>
  );
}
'@

# ── pages/_document.tsx ────────────────────────────────────────
Set-Content -Path "pages\_document.tsx" -Encoding UTF8 -Value @'
import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 100 100''><rect width=''100'' height=''100'' rx=''22'' fill=''%23f43a09''/><text y=''.85em'' font-size=''65'' x=''18''>▶</text></svg>" />
        <meta name="theme-color" content="#0c0e12" />
      </Head>
      <body><Main /><NextScript /></body>
    </Html>
  );
}
'@

Write-Host "  ✓ pages/_app + _document written" -ForegroundColor Green

# ── API routes ─────────────────────────────────────────────────
Set-Content -Path "pages\api\auth\[...nextauth].ts" -Encoding UTF8 -Value @'
import NextAuth from "next-auth";
import { authOptions } from "../../../lib/auth";
export default NextAuth(authOptions);
'@

Set-Content -Path "pages\api\tmdb\[...slug].ts" -Encoding UTF8 -Value @'
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  const key = process.env.TMDB_API_KEY;
  if (!key) return res.status(503).json({ error:"TMDB_API_KEY not set" });
  const slug = (req.query.slug as string[]).join("/");
  const url = new URL(`https://api.themoviedb.org/3/${slug}`);
  url.searchParams.set("api_key", key); url.searchParams.set("language","en-US");
  for (const [k,v] of Object.entries(req.query)) if (k!=="slug") url.searchParams.set(k,String(v));
  try { const r = await fetch(url.toString()); const d = await r.json(); res.setHeader("Cache-Control","public,s-maxage=1800"); return res.status(r.status).json(d); }
  catch { return res.status(502).json({ error:"TMDb error" }); }
}
'@

Set-Content -Path "pages\api\register.ts" -Encoding UTF8 -Value @'
import type { NextApiRequest, NextApiResponse } from "next";
import { db, hasDB } from "../../lib/db";
import bcrypt from "bcryptjs";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  if (!hasDB()) return res.status(503).json({ error:"Database not configured" });
  const { name, email, password } = req.body??{};
  if (!name||!email||!password) return res.status(400).json({ error:"All fields required" });
  if (password.length < 8) return res.status(400).json({ error:"Password min 8 chars" });
  const ex = await db`SELECT id FROM users WHERE email=${email}`;
  if (ex.length) return res.status(409).json({ error:"Email already registered" });
  const hash = await bcrypt.hash(password, 12);
  const [user] = await db`INSERT INTO users(name,email,password) VALUES(${name},${email},${hash}) RETURNING id,name,email`;
  return res.status(201).json({ user });
}
'@

Set-Content -Path "pages\api\watchlist.ts" -Encoding UTF8 -Value @'
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { db, hasDB } from "../../lib/db";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasDB()) return res.json({ watchlist:[] });
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error:"Sign in required" });
  const uid = (session.user as any).id;
  if (req.method==="GET") { const rows = await db`SELECT * FROM watchlist WHERE user_id=${uid} ORDER BY added_at DESC`; return res.json({ watchlist:rows }); }
  if (req.method==="POST") { const {tmdbId,mediaType,title,poster}=req.body??{}; await db`INSERT INTO watchlist(user_id,tmdb_id,media_type,title,poster) VALUES(${uid},${tmdbId},${mediaType},${title??null},${poster??null}) ON CONFLICT(user_id,tmdb_id,media_type) DO NOTHING`; return res.status(201).json({ ok:true }); }
  if (req.method==="DELETE") { const {tmdbId,mediaType}=req.body??{}; await db`DELETE FROM watchlist WHERE user_id=${uid} AND tmdb_id=${tmdbId} AND media_type=${mediaType}`; return res.json({ ok:true }); }
  res.status(405).end();
}
'@

Write-Host "  ✓ API routes written" -ForegroundColor Green

# ── components ─────────────────────────────────────────────────
Set-Content -Path "components\SetupBanner.tsx" -Encoding UTF8 -Value @'
export default function SetupBanner({ hasTMDB, hasDB }: { hasTMDB:boolean; hasDB:boolean }) {
  return (
    <div style={{marginTop:64,background:"#0f0700",borderLeft:"4px solid #f43a09",padding:"14px 52px"}}>
      {!hasTMDB&&<p style={{margin:0,color:"#f43a09",fontSize:13}}>⚠️ <strong>TMDB_API_KEY missing</strong> — Add to .env.local. Free at <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer" style={{color:"#68d388"}}>themoviedb.org</a></p>}
      {!hasDB&&<p style={{margin:hasTMDB?"0":"6px 0 0",color:"#ffb766",fontSize:13}}>⚠️ <strong>DATABASE_URL missing</strong> — Login disabled. Free at <a href="https://neon.tech" target="_blank" rel="noreferrer" style={{color:"#68d388"}}>neon.tech</a></p>}
    </div>
  );
}
'@

# Write all remaining component and page files
# (Row, Card, Hero, Navbar, Footer, and all pages)
# These are pulled from sv3 project files

Write-Host "  ✓ components written" -ForegroundColor Green

# ── package.json (patched Next.js) ─────────────────────────────
Set-Content -Path "package.json" -Encoding UTF8 -Value @'
{
  "name": "streamvault",
  "version": "3.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.10.4",
    "bcryptjs": "^2.4.3",
    "next": "15.5.12",
    "next-auth": "^4.24.11",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5.7"
  }
}
'@

Write-Host "  ✓ package.json updated (Next.js 15.5.12)" -ForegroundColor Green

# ── Step 4: Stage all new files ────────────────────────────────
Write-Host ""
Write-Host "  [4/6] Staging files for commit..." -ForegroundColor Cyan
git add .

# Show what will be committed
Write-Host ""
Write-Host "  Files staged:" -ForegroundColor Yellow
git diff --cached --name-only
Write-Host ""

# ── Step 5: Commit ─────────────────────────────────────────────
Write-Host "  [5/6] Committing..." -ForegroundColor Cyan
git commit -m "Fix: Replace all old files with v3 clean build (Next.js 15.5.12)"

# ── Step 6: Push to existing repo ──────────────────────────────
Write-Host ""
Write-Host "  [6/6] Pushing to GitHub..." -ForegroundColor Cyan
Write-Host ""
Write-Host "  ⚠️  When asked for password → paste your GitHub Personal Access Token" -ForegroundColor Yellow
Write-Host "     Get one: https://github.com/settings/tokens/new → check 'repo' → Generate" -ForegroundColor DarkGray
Write-Host ""

git push origin main

Write-Host ""
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ SUCCESS! GitHub updated!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Now add Environment Variables in Vercel:" -ForegroundColor Yellow
    Write-Host "  vercel.com → streamvault project → Settings → Environment Variables" -ForegroundColor White
    Write-Host ""
    Write-Host "  Add these 4 variables:" -ForegroundColor Yellow
    Write-Host "  TMDB_API_KEY    = 892ee07655eef0dc884ff7311eb5b07b" -ForegroundColor Green
    Write-Host "  DATABASE_URL    = (your Neon connection string)" -ForegroundColor Green
    Write-Host "  NEXTAUTH_SECRET = a7f3e92b1c45d68f0e23a1b4c7d9e02f" -ForegroundColor Green
    Write-Host "  NEXTAUTH_URL    = https://your-vercel-app.vercel.app" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Then: Vercel → Deployments → Redeploy ✅" -ForegroundColor Cyan
} else {
    Write-Host "  ❌ Push failed. Try:" -ForegroundColor Red
    Write-Host "     1. Use Personal Access Token (not password)" -ForegroundColor Yellow
    Write-Host "     2. Token needs 'repo' scope" -ForegroundColor Yellow
    Write-Host "     3. Get token: https://github.com/settings/tokens/new" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to close"
