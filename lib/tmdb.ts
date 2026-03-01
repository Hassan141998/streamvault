// lib/tmdb.ts — TMDb API helpers
const BASE = "https://api.themoviedb.org/3";
const IMG  = "https://image.tmdb.org/t/p";

export function posterUrl(path: string | null, size = "w342") {
  return path ? `${IMG}/${size}${path}` : "/placeholder-poster.jpg";
}
export function backdropUrl(path: string | null, size = "w1280") {
  return path ? `${IMG}/${size}${path}` : "/placeholder-backdrop.jpg";
}
export function profileUrl(path: string | null) {
  return path ? `${IMG}/w185${path}` : "/placeholder-person.jpg";
}

async function get(path: string, params: Record<string, string> = {}) {
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", key);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  try {
    const r = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!r.ok) return null;
    return r.json();
  } catch { return null; }
}

export const tmdb = {
  trending:      () => get("/trending/all/week"),
  topMovies:     () => get("/movie/top_rated"),
  nowPlaying:    () => get("/movie/now_playing"),
  popularTV:     () => get("/tv/popular"),
  bollywood:     () => get("/discover/movie", { with_origin_country: "IN", sort_by: "popularity.desc" }),
  turkish:       () => get("/discover/tv",    { with_origin_country: "TR", sort_by: "popularity.desc" }),
  french:        () => get("/discover/movie", { with_origin_country: "FR", sort_by: "popularity.desc" }),
  pakistani:     () => get("/discover/tv",    { with_origin_country: "PK", sort_by: "popularity.desc" }),
  movieDetail:   (id: number) => get(`/movie/${id}`, { append_to_response: "credits,videos,similar" }),
  tvDetail:      (id: number) => get(`/tv/${id}`,    { append_to_response: "credits,videos,similar" }),
  search:        (q: string, page = "1") => get("/search/multi", { query: q, page }),
  movieVideos:   (id: number) => get(`/movie/${id}/videos`),
};

export function getBestYouTubeKey(videos: any): string | null {
  if (!videos?.results?.length) return null;
  const yt = videos.results.filter((v: any) => v.site === "YouTube");
  return (yt.find((v: any) => v.type === "Trailer") ?? yt[0])?.key ?? null;
}
