# ============================================================
# StreamVault — One-Click GitHub Push Script
# Double-click this file OR run in PowerShell:
#   .\PUSH_TO_GITHUB.ps1
# ============================================================

Write-Host ""
Write-Host "  ▶ StreamVault — GitHub Push" -ForegroundColor Red
Write-Host "  ================================" -ForegroundColor DarkGray
Write-Host ""

# Step 1: Check we are in the right folder
if (-not (Test-Path "package.json")) {
    Write-Host "  ❌ ERROR: Run this script from your streamvault project folder!" -ForegroundColor Red
    Write-Host "     cd E:\pycharm\streamvault" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

# Step 2: Remove old broken git
Write-Host "  [1/5] Removing old git history..." -ForegroundColor Cyan
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

# Step 3: Remove node_modules warning
if (Test-Path "node_modules") {
    Write-Host "  [2/5] node_modules found — it will be excluded by .gitignore ✓" -ForegroundColor Green
} else {
    Write-Host "  [2/5] No node_modules folder (good)" -ForegroundColor Green
}

# Step 4: Init and stage
Write-Host "  [3/5] Initializing git..." -ForegroundColor Cyan
git init
git add .

# Show what will be pushed
Write-Host ""
Write-Host "  Files to be pushed:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Safety check
$fileCount = (git status --short | Measure-Object -Line).Lines
if ($fileCount -gt 200) {
    Write-Host "  ⚠️  WARNING: $fileCount files detected — node_modules may not be excluded!" -ForegroundColor Red
    Write-Host "     Check that .gitignore has: /node_modules" -ForegroundColor Yellow
    $confirm = Read-Host "  Continue anyway? (y/n)"
    if ($confirm -ne "y") { exit }
}

# Step 5: Commit
Write-Host "  [4/5] Committing..." -ForegroundColor Cyan
git commit -m "StreamVault v3 - Next.js 15.5.12 patched"
git branch -M main

# Step 6: Push
Write-Host "  [5/5] Pushing to GitHub..." -ForegroundColor Cyan
Write-Host ""
Write-Host "  ℹ️  When asked for password → paste your GitHub Personal Access Token" -ForegroundColor Yellow
Write-Host "     Get one at: https://github.com/settings/tokens/new (check 'repo')" -ForegroundColor DarkGray
Write-Host ""

git remote remove origin 2>$null
git remote add origin https://github.com/Hassan141998/streamvault.git
git push -u origin main

Write-Host ""
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host "     View at: https://github.com/Hassan141998/streamvault" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Next step → Deploy on Vercel:" -ForegroundColor Yellow
    Write-Host "  1. Go to vercel.com → Add New Project → import streamvault" -ForegroundColor White
    Write-Host "  2. Settings → Environment Variables → add:" -ForegroundColor White
    Write-Host "     TMDB_API_KEY     = 892ee07655eef0dc884ff7311eb5b07b" -ForegroundColor Green
    Write-Host "     DATABASE_URL     = (your Neon connection string)" -ForegroundColor Green
    Write-Host "     NEXTAUTH_SECRET  = (any 32+ char random string)" -ForegroundColor Green
    Write-Host "     NEXTAUTH_URL     = https://your-project.vercel.app" -ForegroundColor Green
    Write-Host "  3. Redeploy" -ForegroundColor White
} else {
    Write-Host "  ❌ Push failed. Common fixes:" -ForegroundColor Red
    Write-Host "     - Use Personal Access Token as password (not your GitHub password)" -ForegroundColor Yellow
    Write-Host "     - Delete repo on GitHub and create fresh empty one" -ForegroundColor Yellow
    Write-Host "     - Make sure repo exists: github.com/Hassan141998/streamvault" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to close"
