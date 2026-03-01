/**
 * pages/api/history.ts
 */
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { query, isDBAvailable } from "../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isDBAvailable()) {
    if (req.method === "GET") return res.json({ history: [] });
    return res.status(503).json({ error: "Database not configured" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Please sign in" });
  const userId = (session.user as any).id;

  if (req.method === "GET") {
    const rows = await query`SELECT * FROM history WHERE user_id = ${userId} ORDER BY watched_at DESC LIMIT 50`;
    return res.json({ history: rows });
  }
  if (req.method === "POST") {
    const { tmdbId, mediaType, title, poster, progress = 0, season = null, episode = null } = req.body ?? {};
    await query`
      INSERT INTO history (user_id, tmdb_id, media_type, title, poster, progress, season, episode, watched_at)
      VALUES (${userId}, ${tmdbId}, ${mediaType}, ${title}, ${poster}, ${progress}, ${season}, ${episode}, NOW())
      ON CONFLICT DO NOTHING`;
    return res.status(201).json({ ok: true });
  }
  res.status(405).end();
}
