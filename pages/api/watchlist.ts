import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { db, hasDB } from "../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasDB()) return res.json({ watchlist: [] });
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Sign in required" });
  const uid = (session.user as any).id;

  if (req.method === "GET") {
    const rows = await db`SELECT * FROM watchlist WHERE user_id=${uid} ORDER BY added_at DESC`;
    return res.json({ watchlist: rows });
  }
  if (req.method === "POST") {
    const { tmdbId, mediaType, title, poster } = req.body ?? {};
    await db`
      INSERT INTO watchlist(user_id,tmdb_id,media_type,title,poster)
      VALUES(${uid},${tmdbId},${mediaType},${title??null},${poster??null})
      ON CONFLICT(user_id,tmdb_id,media_type) DO NOTHING`;
    return res.status(201).json({ ok: true });
  }
  if (req.method === "DELETE") {
    const { tmdbId, mediaType } = req.body ?? {};
    await db`DELETE FROM watchlist WHERE user_id=${uid} AND tmdb_id=${tmdbId} AND media_type=${mediaType}`;
    return res.json({ ok: true });
  }
  return res.status(405).end();
}
