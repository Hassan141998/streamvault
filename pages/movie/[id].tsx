import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { tmdb, backdropUrl, posterUrl, profileUrl, getTrailerKey } from "../../lib/tmdb";
import Navbar from "../../components/Navbar";
import Row from "../../components/Row";
import Footer from "../../components/Footer";

const PLAYERS = [
  { id: "vidsrc",      label: "VidSrc",     color: "#f43a09" },
  { id: "vidsrc2",     label: "VidSrc 2",   color: "#ffb766" },
  { id: "autoembed",   label: "AutoEmbed",  color: "#68d388" },
  { id: "2embed",      label: "2Embed",     color: "#c2edda" },
  { id: "smashy",      label: "Smashy",     color: "#a78bfa" },
  { id: "multiembed",  label: "MultiEmbed", color: "#fb7185" },
];

function embedUrl(pid: string, id: number) {
  switch (pid) {
    case "vidsrc":     return `https://vidsrc.to/embed/movie/${id}`;
    case "vidsrc2":    return `https://vidsrc.xyz/embed/movie?tmdb=${id}`;
    case "autoembed":  return `https://player.autoembed.cc/embed/movie/${id}`;
    case "2embed":     return `https://www.2embed.cc/embed/${id}`;
    case "smashy":     return `https://embed.smashystream.com/playere.php?tmdb=${id}`;
    case "multiembed": return `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`;
    default:           return `https://vidsrc.to/embed/movie/${id}`;
  }
}

const MoviePage: NextPage<{ movie: any }> = ({ movie }) => {
  const [trailer, setTrailer] = useState(false);
  const [player, setPlayer]   = useState("vidsrc");
  const [watching, setWatching] = useState(false);

  if (!movie) return <div style={{ minHeight: "100vh", background: "#0c0e12", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#64748b" }}>Not found. <Link href="/" style={{ color: "#f43a09" }}>Go Home</Link></p></div>;

  const key     = getTrailerKey(movie.videos);
  const cast    = movie.credits?.cast?.slice(0, 14) ?? [];
  const related = movie.similar?.results?.slice(0, 12) ?? [];
  const year    = movie.release_date?.slice(0, 4) ?? "";
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "";
  const rating  = movie.vote_average ? Number(movie.vote_average).toFixed(1) : "—";

  return (
    <>
      <Head><title>{movie.title} — StreamVault</title><meta name="description" content={movie.overview?.slice(0, 160)} /></Head>
      <Navbar transparent />

      {/* Watch player — shown when watching */}
      {watching && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "#000", display: "flex", flexDirection: "column" as const }}>
          {/* Top bar */}
          <div style={{ height: 50, background: "rgba(12,14,18,0.98)", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", padding: "0 16px", gap: 12, flexShrink: 0 }}>
            <button onClick={() => setWatching(false)} style={{ background: "none", border: "none", color: "#f43a09", fontSize: 18, cursor: "pointer" }}>✕</button>
            <span style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 700 }}>{movie.title}</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              {PLAYERS.map(p => (
                <button key={p.id} onClick={() => setPlayer(p.id)}
                  style={{ padding: "4px 12px", borderRadius: 7, border: `1px solid ${player === p.id ? p.color : "rgba(255,255,255,0.08)"}`, background: player === p.id ? `${p.color}20` : "transparent", color: player === p.id ? p.color : "#64748b", fontSize: 11, fontWeight: 700 }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <iframe key={`${player}-${movie.id}`} src={embedUrl(player, movie.id)} allowFullScreen allow="autoplay;fullscreen" style={{ flex: 1, border: "none" }} />
        </div>
      )}

      {/* Backdrop hero */}
      <div style={{ position: "relative", minHeight: "90vh", background: "#0c0e12" }}>
        {movie.backdrop_path && <img src={backdropUrl(movie.backdrop_path, "original")} alt="" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.28, pointerEvents: "none" }} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,rgba(12,14,18,0.97) 35%,rgba(12,14,18,0.55) 65%,transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,#0c0e12,transparent 50%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: 1300, margin: "0 auto", padding: "120px 52px 60px", display: "flex", gap: 48, flexWrap: "wrap" as const, alignItems: "flex-start" }}>
          <img src={posterUrl(movie.poster_path, "w342")} alt={movie.title} onError={e => { (e.target as HTMLImageElement).src = "/placeholder-poster.jpg"; }} style={{ width: 220, borderRadius: 18, boxShadow: "0 24px 60px rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }} />

          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" as const, marginBottom: 14 }}>
              {movie.genres?.map((g: any) => <span key={g.id} style={{ background: "rgba(244,58,9,0.12)", color: "#f43a09", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, border: "1px solid rgba(244,58,9,0.25)" }}>{g.name}</span>)}
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(24px,4vw,52px)", fontWeight: 900, color: "#fff", lineHeight: 1.08, marginBottom: 12 }}>{movie.title}</h1>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" as const, alignItems: "center", marginBottom: 14 }}>
              <span style={{ color: "#fbbf24", fontWeight: 800 }}>★ {rating}</span>
              {year && <span style={{ color: "#64748b" }}>{year}</span>}
              {runtime && <span style={{ color: "#64748b" }}>{runtime}</span>}
              <span style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "#94a3b8", padding: "2px 10px", borderRadius: 5, fontSize: 11, fontWeight: 700 }}>4K HDR</span>
            </div>
            <p style={{ color: "#94a3b8", lineHeight: 1.78, marginBottom: 26, maxWidth: 520, fontSize: 14 }}>{movie.overview}</p>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, marginBottom: 20 }}>
              <button onClick={() => setWatching(true)} style={{ background: "linear-gradient(135deg,#c4290a,#f43a09)", color: "#fff", padding: "13px 30px", borderRadius: 11, fontSize: 14, fontWeight: 800, border: "none", boxShadow: "0 0 28px rgba(244,58,9,0.45)", cursor: "pointer" }}>
                ▶ Watch Now
              </button>
              {key && <button onClick={() => setTrailer(true)} style={{ padding: "13px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: 11, fontSize: 13, fontWeight: 700 }}>🎬 Trailer</button>}
            </div>

            {/* Player selector */}
            <div style={{ marginBottom: 22 }}>
              <p style={{ color: "#64748b", fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "2px", marginBottom: 8 }}>Choose streaming server</p>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" as const }}>
                {PLAYERS.map(p => (
                  <button key={p.id} onClick={() => setPlayer(p.id)}
                    style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${player === p.id ? p.color : "rgba(255,255,255,0.1)"}`, background: player === p.id ? `${p.color}20` : "rgba(255,255,255,0.05)", color: player === p.id ? p.color : "#64748b", fontSize: 11, fontWeight: 700 }}>
                    {p.label}
                  </button>
                ))}
              </div>
              <p style={{ color: "#334155", fontSize: 11, marginTop: 7 }}>Smashy = Hindi dubbed · 2Embed = subtitles · VidSrc = best quality</p>
            </div>

            {/* Meta */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, maxWidth: 520 }}>
              {[["Language", movie.original_language?.toUpperCase()], ["Released", movie.release_date?.slice(0, 10) ?? "—"], ["Runtime", runtime || "—"], ["Status", movie.status ?? "—"]].map(([l, v]) => (
                <div key={l} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 11, padding: "12px 14px" }}>
                  <p style={{ margin: "0 0 4px", color: "#334155", fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "1.5px" }}>{l}</p>
                  <p style={{ margin: 0, color: "#f1f5f9", fontSize: 13, fontWeight: 600 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cast */}
      {cast.length > 0 && (
        <section style={{ maxWidth: 1300, margin: "0 auto", padding: "0 52px 48px" }}>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: "#f1f5f9", marginBottom: 18 }}>Cast</h2>
          <div className="hide-scrollbar" style={{ display: "flex", gap: 14, overflowX: "auto" }}>
            {cast.map((p: any) => (
              <div key={p.id} style={{ flexShrink: 0, width: 88, textAlign: "center" as const }}>
                <img src={profileUrl(p.profile_path)} alt={p.name} onError={e => { (e.target as HTMLImageElement).src = "/placeholder-person.jpg"; }} style={{ width: 66, height: 66, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.1)", marginBottom: 6 }} />
                <p style={{ fontSize: 11, fontWeight: 700, color: "#f1f5f9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, marginBottom: 2 }}>{p.name}</p>
                <p style={{ fontSize: 10, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{p.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && <Row title="More Like This" items={related} accent="#c2edda" type="movie" />}

      {/* Trailer modal */}
      {trailer && key && (
        <div onClick={() => setTrailer(false)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "min(880px,94vw)", aspectRatio: "16/9", position: "relative" }}>
            <iframe src={`https://www.youtube.com/embed/${key}?autoplay=1&rel=0`} allow="autoplay;encrypted-media" allowFullScreen style={{ width: "100%", height: "100%", border: "none", borderRadius: 14 }} />
            <button onClick={() => setTrailer(false)} style={{ position: "absolute", top: -42, right: 0, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", width: 34, height: 34, borderRadius: "50%", fontSize: 14 }}>✕</button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = parseInt(params?.id as string);
  if (isNaN(id)) return { notFound: true };
  try { const movie = await tmdb.movieDetail(id); if (!movie?.id) return { notFound: true }; return { props: { movie } }; }
  catch { return { notFound: true }; }
};
export default MoviePage;
