#!/usr/bin/env python3
"""
StreamVault - Fix BOM encoding issue and push to GitHub
Run: python FIX_BOM_AND_PUSH.py
"""
import json, os, subprocess, sys

print("\n  ▶ StreamVault — Fix BOM + Push to GitHub\n")

# Check correct folder
if not os.path.exists("package.json"):
    print("  ❌ Run this from E:\\pycharm\\streamvault")
    input("Press Enter to exit")
    sys.exit(1)

# ── Fix package.json (NO BOM) ──────────────────────────────────
pkg = {
    "name": "streamvault",
    "version": "3.0.0",
    "private": True,
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

files_to_write = {
    "package.json": json.dumps(pkg, indent=2) + "\n",

    "tsconfig.json": json.dumps({
        "compilerOptions": {
            "target": "ES2017",
            "lib": ["dom","dom.iterable","esnext"],
            "allowJs": True,
            "skipLibCheck": True,
            "strict": False,
            "noEmit": True,
            "esModuleInterop": True,
            "module": "esnext",
            "moduleResolution": "bundler",
            "resolveJsonModule": True,
            "isolatedModules": True,
            "jsx": "preserve",
            "incremental": True
        },
        "include": ["next-env.d.ts","**/*.ts","**/*.tsx"],
        "exclude": ["node_modules"]
    }, indent=2) + "\n",

    "vercel.json": json.dumps({"version": 2, "framework": "nextjs"}, indent=2) + "\n",

    "next.config.js": '/** @type {import(\'next\').NextConfig} */\nmodule.exports = {\n  images: { domains: ["image.tmdb.org"] }\n};\n',

    ".gitignore": "node_modules/\n.next/\n.env.local\n.env\n.vercel/\n*.tsbuildinfo\nnext-env.d.ts\nout/\n",
}

print("  [1/3] Writing files without BOM encoding...")
for filename, content in files_to_write.items():
    with open(filename, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    # Verify no BOM
    with open(filename, "rb") as f:
        first3 = f.read(3)
    status = "✓" if first3 != b"\xef\xbb\xbf" else "✗ BOM STILL PRESENT"
    print(f"     {status} {filename}")

# Verify JSON validity
for fname in ["package.json", "tsconfig.json", "vercel.json"]:
    try:
        with open(fname, encoding="utf-8") as f:
            json.load(f)
        print(f"     ✓ {fname} is valid JSON")
    except Exception as e:
        print(f"     ✗ {fname} JSON error: {e}")

print("\n  [2/3] Staging changes in git...")
subprocess.run(["git", "add", "package.json", "tsconfig.json", "vercel.json",
                "next.config.js", ".gitignore"], check=False)
subprocess.run(["git", "rm", "-r", "--cached", "node_modules"], 
               capture_output=True)  # silently remove node_modules from git
subprocess.run(["git", "add", "."], check=False)

print("  [3/3] Committing and pushing...")
subprocess.run(["git", "commit", "-m", "Fix: Remove BOM encoding, patch Next.js 15.5.12, remove node_modules"], check=False)

print("\n  When asked for password → use your GitHub Personal Access Token")
print("  Get one at: https://github.com/settings/tokens/new (check 'repo')\n")
result = subprocess.run(["git", "push", "origin", "main"])

if result.returncode == 0:
    print("\n  ✅ Pushed! Now go to Vercel → Deployments → Redeploy")
else:
    print("\n  ❌ Push failed — check your token has 'repo' scope")

input("\nPress Enter to close")
