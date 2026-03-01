# StreamVault — Complete Fix Guide
## 3 Problems Solved: GitHub Upload + TMDB Form + Backend Language Options

---

# PROBLEM 1: GitHub "Too Many Files" Error

## Why This Happened
You uploaded the `node_modules` folder to GitHub. It contains **60,000+ files** (JavaScript packages). You must NEVER upload it.

## Fix — Upload with Git (Correct Method)

### Step 1: Make sure .gitignore exists
Your project already has a `.gitignore` file that blocks `node_modules`. Confirm it has this line:
```
/node_modules
```

### Step 2: Delete your broken GitHub repo
1. Go to github.com/Hassan141998/streamvault
2. Click **Settings** → scroll to bottom → **"Delete this repository"**
3. Type the repo name to confirm → Delete

### Step 3: Create fresh repo on GitHub
1. Go to https://github.com/new
2. Name: `streamvault`
3. ❌ Do NOT tick "Add README"
4. ❌ Do NOT tick "Add .gitignore"
5. Click **Create repository**

### Step 4: Upload via Git commands (PowerShell)
```powershell
# Go to your project folder
cd E:\pycharm\streamvault

# If you already ran git init before, reset it:
Remove-Item -Recurse -Force .git

# Start fresh
git init
git add .
git status   # ← you should see ~30 files, NOT node_modules

git commit -m "StreamVault initial commit"
git branch -M main
git remote add origin https://github.com/Hassan141998/streamvault.git
git push -u origin main
```

When it asks for password → use a Personal Access Token:
1. Go to https://github.com/settings/tokens/new
2. Note: `streamvault deploy`
3. Expiration: 90 days
4. Check the `repo` box
5. Click Generate → Copy the token
6. Paste as your password in PowerShell

### ✅ Result
GitHub will show ~32 files — no node_modules, no errors.

---

# PROBLEM 2: TMDB Developer Form

## How to Fill the Form Correctly

Go to: https://www.themoviedb.org/settings/api

### Field-by-field guide:

| Field | What to Write |
|-------|--------------|
| **Application Name** | StreamVault |
| **Application URL** | `https://localhost` (for now, change after Vercel deploy) |
| **Application Summary** | Personal movie streaming website I am building to learn web development using the TMDb API to display movie information, posters and trailers. |
| **Type of Use** | ✅ Website |
| **First Name** | Your first name |
| **Last Name** | Your last name |
| **Email Address** | Your email |
| **Phone Number** | Your phone (optional) |
| **Address 1** | Your street address |
| **City** | Your city (e.g. Karachi) |
| **State** | Sindh |
| **Post Code** | Your postal code (e.g. 75500) |
| **Country** | Pakistan |

### ⚠️ Important:
- Application URL must start with `https://` — use `https://localhost` if you don't have a live URL yet
- After Vercel deploy, update it to `https://streamvault-hassan.vercel.app`
- Check the Terms of Use checkbox at the bottom
- Click **Submit**

### You will receive:
- **API Key (v3 auth)** — a long string like `abc123def456abc123def456`
- Copy it → paste as `TMDB_API_KEY` in your `.env.local`

---

# PROBLEM 3: Backend Language Options for StreamVault

StreamVault currently uses **Next.js (JavaScript/TypeScript)** for everything — frontend and backend API. Here is how you can replace or add a backend in different languages:

---

## Option A — Python (FastAPI) Backend

**Best for:** Python developers, AI/ML features, data science

### Architecture:
```
Frontend: Next.js (React)  →  Port 3000
Backend:  FastAPI (Python) →  Port 8000
Database: Neon PostgreSQL
```

### Setup:

**1. Create Python backend folder:**
```
streamvault/
├── frontend/          ← Next.js (move files here)
└── backend/           ← New Python FastAPI
    ├── main.py
    ├── requirements.txt
    └── .env
```

**2. requirements.txt:**
```
fastapi==0.111.0
uvicorn==0.30.1
httpx==0.27.0
python-jose==3.3.0
passlib==1.7.4
bcrypt==4.1.3
psycopg2-binary==2.9.9
python-dotenv==1.0.1
pydantic==2.7.4
```

**3. main.py (Python FastAPI backend):**
```python
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import httpx, os, psycopg2
from pydantic import BaseModel
import bcrypt

app = FastAPI(title="StreamVault API")

# Allow Next.js frontend to call this backend
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000","https://your-vercel-app.vercel.app"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

TMDB_KEY = os.getenv("TMDB_API_KEY")
DB_URL   = os.getenv("DATABASE_URL")

def get_db():
    return psycopg2.connect(DB_URL)

# ── Movies (proxy TMDb) ────────────────────────────────
@app.get("/api/trending")
async def trending():
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://api.themoviedb.org/3/trending/all/week?api_key={TMDB_KEY}&language=en-US")
        return r.json()

@app.get("/api/movie/{movie_id}")
async def movie_detail(movie_id: int):
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_KEY}&append_to_response=credits,videos,similar")
        return r.json()

@app.get("/api/search")
async def search(q: str):
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://api.themoviedb.org/3/search/multi?api_key={TMDB_KEY}&query={q}")
        return r.json()

# ── Auth ──────────────────────────────────────────────
class RegisterBody(BaseModel):
    name: str
    email: str
    password: str

@app.post("/api/register")
def register(body: RegisterBody):
    hashed = bcrypt.hashpw(body.password.encode(), bcrypt.gensalt()).decode()
    conn = get_db()
    cur  = conn.cursor()
    try:
        cur.execute("INSERT INTO users(name,email,password) VALUES(%s,%s,%s) RETURNING id,name,email", (body.name, body.email, hashed))
        user = cur.fetchone()
        conn.commit()
        return {"user": {"id": user[0], "name": user[1], "email": user[2]}}
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, str(e))
    finally:
        conn.close()

# ── Watchlist ─────────────────────────────────────────
@app.get("/api/watchlist/{user_id}")
def get_watchlist(user_id: int):
    conn = get_db()
    cur  = conn.cursor()
    cur.execute("SELECT * FROM watchlist WHERE user_id=%s ORDER BY added_at DESC", (user_id,))
    rows = cur.fetchall()
    conn.close()
    return {"watchlist": rows}

# Run: uvicorn main:app --reload
```

**4. Run:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Deploy Python backend:** Use **Railway.app** (free) or **Render.com** (free)

---

## Option B — Django Backend (Python)

**Best for:** Admin panel, full-featured Python web framework

```
streamvault/
└── backend-django/
    ├── manage.py
    ├── requirements.txt
    └── api/
        ├── views.py
        ├── models.py
        └── urls.py
```

**requirements.txt:**
```
django==5.0.6
djangorestframework==3.15.2
django-cors-headers==4.4.0
requests==2.32.3
psycopg2-binary==2.9.9
python-decouple==3.8
```

**Run:**
```bash
python manage.py runserver 8000
```

---

## Option C — Go (Golang) Backend

**Best for:** Maximum performance, high traffic, fast API

**Fastest option** — Go handles 100,000+ requests/second easily.

```go
// main.go
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "os"
)

func trending(w http.ResponseWriter, r *http.Request) {
    key  := os.Getenv("TMDB_API_KEY")
    resp, _ := http.Get(fmt.Sprintf("https://api.themoviedb.org/3/trending/all/week?api_key=%s", key))
    defer resp.Body.Close()
    var data map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&data)
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(data)
}

func main() {
    http.HandleFunc("/api/trending", trending)
    http.ListenAndServe(":8000", nil)
}
```

**Run:** `go run main.go`

---

## Option D — Java (Spring Boot) Backend

**Best for:** Enterprise projects, very large teams

```xml
<!-- pom.xml dependencies -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

```java
// MovieController.java
@RestController
@RequestMapping("/api")
public class MovieController {
    @GetMapping("/trending")
    public ResponseEntity<String> trending() {
        RestTemplate rt = new RestTemplate();
        String url = "https://api.themoviedb.org/3/trending/all/week?api_key=" + tmdbKey;
        return rt.getForEntity(url, String.class);
    }
}
```

**Run:** `mvn spring-boot:run`

---

## Option E — PHP (Laravel) Backend

**Best for:** Shared hosting (cPanel), cheapest hosting

```php
// routes/api.php
Route::get('/trending', function () {
    $key = env('TMDB_API_KEY');
    $data = Http::get("https://api.themoviedb.org/3/trending/all/week?api_key={$key}")->json();
    return response()->json($data);
});
```

**Run:** `php artisan serve --port=8000`

---

## Option F — Node.js Express (keep backend in JS, separate from Next.js)

**Best for:** If you want to keep JavaScript but have a dedicated separate backend

```javascript
// server.js
const express = require('express')
const axios   = require('axios')
const app     = express()

app.get('/api/trending', async (req, res) => {
    const { data } = await axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.TMDB_API_KEY}`)
    res.json(data)
})

app.listen(8000)
```

---

## Comparison Table

| Language | Speed | Easy to Learn | Hosting Options | Best For |
|----------|-------|--------------|-----------------|----------|
| **Next.js (current)** | ⚡⚡⚡ | ✅✅✅ | Vercel (free) | Your current setup — keep it |
| **Python FastAPI** | ⚡⚡⚡ | ✅✅✅ | Railway, Render | AI/ML features, Python devs |
| **Python Django** | ⚡⚡ | ✅✅ | Railway, Render | Admin panels, big projects |
| **Go** | ⚡⚡⚡⚡ | ✅ | Fly.io, Railway | Max performance |
| **Java Spring** | ⚡⚡⚡ | ✅ | Render, Railway | Enterprise scale |
| **PHP Laravel** | ⚡⚡ | ✅✅ | cPanel shared | Cheap hosting |
| **Node Express** | ⚡⚡⚡ | ✅✅✅ | Render, Railway | Separate JS backend |

## 💡 My Recommendation

**Keep your current Next.js backend** — it's the fastest path to production. Next.js API routes ARE a proper backend (Node.js). Once your site is working and live, then add Python FastAPI as a microservice for specific features like AI recommendations.

---

## Free Hosting for Backends

| Service | Free Tier | Best Language |
|---------|-----------|---------------|
| Vercel | ✅ Generous | Next.js only |
| Railway | ✅ $5 credit | Python, Go, Java, Node |
| Render | ✅ Free tier | Python, Node, Go |
| Fly.io | ✅ Free small | Any (Docker) |
| cPanel | ❌ Paid | PHP only |
| Heroku | ❌ Paid | Python, Node, Java |

---

*StreamVault Setup Guide — v2.0*
