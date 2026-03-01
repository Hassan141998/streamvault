// lib/tmdb.ts — All TMDb API helpers (server-side only)
const BASE = "https://api.themoviedb.org/3";
const IMG  = "https://image.tmdb.org/t/p";

export const posterUrl   = (p: string|null, s="w342")  => p ? `${IMG}/${s}${p}` : "/placeholder-poster.jpg";
export const backdropUrl = (p: string|null, s="w1280") => p ? `${IMG}/${s}${p}` : "/placeholder-backdrop.jpg";
export const profileUrl  = (p: string|null)            => p ? `${IMG}/w185${p}`  : "/placeholder-person.jpg";

async function get(path: string, params: Record<string,string> = {}) {
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;
  try {
    const url = new URL(`${BASE}${path}`);
    url.searchParams.set("api_key", key);
    url.searchParams.set("language", "en-US");
    Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
    const r = await fetch(url.toString(), { next: { revalidate: 3600 } });
    return r.ok ? r.json() : null;
  } catch { return null; }
}

export const tmdb = {
  trending:    ()        => get("/trending/all/week"),
  topMovies:   ()        => get("/movie/top_rated"),
  nowPlaying:  ()        => get("/movie/now_playing"),
  popularTV:   ()        => get("/tv/popular"),
  bollywood:   ()        => get("/discover/movie", { with_origin_country:"IN", sort_by:"popularity.desc" }),
  turkish:     ()        => get("/discover/tv",    { with_origin_country:"TR", sort_by:"popularity.desc" }),
  french:      ()        => get("/discover/movie", { with_origin_country:"FR", sort_by:"popularity.desc" }),
  pakistani:   ()        => get("/discover/tv",    { with_origin_country:"PK", sort_by:"popularity.desc" }),
  korean:      ()        => get("/discover/tv",    { with_origin_country:"KR", sort_by:"popularity.desc" }),
  movieDetail: (id: number) => get(`/movie/${id}`, { append_to_response:"credits,videos,similar,watch/providers" }),
  tvDetail:    (id: number) => get(`/tv/${id}`,    { append_to_response:"credits,videos,similar,watch/providers" }),
  search:      (q: string)  => get("/search/multi",{ query:q }),
};

export function getTrailerKey(videos: any): string|null {
  if (!videos?.results?.length) return null;
  const yt = (videos.results as any[]).filter(v => v.site === "YouTube");
  return (yt.find(v => v.type === "Trailer") ?? yt[0])?.key ?? null;
}
