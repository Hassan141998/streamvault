import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  const key = process.env.TMDB_API_KEY;
  if (!key) return res.status(503).json({ error: "TMDB_API_KEY not configured" });

  const slug = (req.query.slug as string[]).join("/");
  const url  = new URL(`https://api.themoviedb.org/3/${slug}`);
  url.searchParams.set("api_key", key);
  url.searchParams.set("language", "en-US");

  // Forward extra query params
  for (const [k, v] of Object.entries(req.query)) {
    if (k !== "slug") url.searchParams.set(k, String(v));
  }

  try {
    const r = await fetch(url.toString());
    const d = await r.json();
    res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=3600");
    return res.status(r.status).json(d);
  } catch {
    return res.status(502).json({ error: "TMDb upstream error" });
  }
}
