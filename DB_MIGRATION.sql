-- Run this in Neon SQL Editor: neon.tech → your project → SQL Editor → paste → Run

CREATE TABLE IF NOT EXISTS users (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(100),
  email          VARCHAR(255) NOT NULL UNIQUE,
  email_verified TIMESTAMPTZ,
  image          TEXT,
  password       TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, provider TEXT NOT NULL, provider_account_id TEXT NOT NULL,
  refresh_token TEXT, access_token TEXT, expires_at INTEGER, token_type TEXT, scope TEXT, id_token TEXT, session_state TEXT
);
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY, session_token TEXT NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL, token TEXT NOT NULL UNIQUE, expires TIMESTAMPTZ NOT NULL, PRIMARY KEY (identifier, token)
);
CREATE TABLE IF NOT EXISTS watchlist (
  id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tmdb_id INTEGER NOT NULL, media_type VARCHAR(10) NOT NULL, title TEXT, poster TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(user_id, tmdb_id, media_type)
);
CREATE TABLE IF NOT EXISTS history (
  id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tmdb_id INTEGER NOT NULL, media_type VARCHAR(10) NOT NULL, title TEXT, poster TEXT,
  season INTEGER, episode INTEGER, watched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verify:
SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;
