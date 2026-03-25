import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { tmdb, posterUrl } from "../../../lib/tmdb";

/* ── Streaming providers ─────────────────────────────────────────────
   All free, no API key needed. Works with TMDb IDs.
   Personal/demo use only.                                             */
const PLAYERS = [
  {
    id: "vidsrc",
    name: "VidSrc",
    color: "#f43a09",
    note: "Best quality",
    url: (type: string, id: number, s: number, e: number) =>
      type === "tv"
        ? `https://vidsrc.to/embed/tv/${id}/${s}/${e}`
        : `https://vidsrc.to/embed/movie/${id}`,
  },
  {
    id: "vidsrc2",
    name: "VidSrc 2",
    color: "#ffb766",
    note: "Backup",
    url: (type: string, id: number, s: number, e: number) =>
      type === "tv"
        ? `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${s}&episode=${e}`
        : `https://vidsrc.xyz/embed/movie?tmdb=${id}`,
  },
  {
    id: "autoembed",
    name: "AutoEmbed",
    color: "#68d388",
    note: "Multi-lang",
    url: (type: string, id: number, s: number, e: number) =>
      type === "tv"
        ? `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`
        : `https://player.autoembed.cc/embed/movie/${id}`,
  },
  {
    id: "2embed",
    name: "2Embed",
    color: "#c2edda",
    note: "Subtitles",
    url: (type: string, id: number, s: number, e: number) =>
      type === "tv"
        ? `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`
        : `https://www.2embed.cc/embed/${id}`,
  },
  {
    id: "smashystream",
    name: "Smashy",
    color: "#a78bfa",
    note: "Dubbed",
    url: (type: string, id: number, s: number, e: number) =>
      type === "tv"
        ? `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${s}&episode=${e}`
        : `https://embed.smashystream.com/playere.php?tmdb=${id}`,
  },
  {
    id: "multiembed",
    name: "MultiEmbed",
    color: "#fb7185",
    note: "HD",
    url: (type: string, id: number, s: number, e: number) =>
      type === "tv"
        ? `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}`
        : `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
  },
];

interface Props {
  item: any;
  type: "movie" | "tv";
  id: number;
}

const WatchPage: NextPage<Props> = ({ item, type, id }) => {
  const [player, setPlayer] = useState(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [loading, setLoading] = useState(true);

  const title  = item?.title ?? item?.name ?? "Unknown";
  const poster = item?.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : "/placeholder-poster.jpg";
  const totalSeasons  = item?.number_of_seasons ?? 1;
  const totalEpisodes = item?.seasons?.find((s: any) => s.season_number === season)?.episode_count ?? 20;

  const currentPlayer = PLAYERS[player];
  const embedUrl = currentPlayer.url(type, id, season, episode);

  return (
    <>
      <Head>
        <title>Watch {title} — StreamVault</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{ minHeight: "100vh", background: "#080b0f", color: "#f1f5f9" }}>

        {/* ── Top bar ── */}
        <div style={{ height: 54, background: "rgba(12,14,18,0.98)", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", padding: "0 20px", gap: 14, position: "sticky", top: 0, zIndex: 100 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#c4290a,#f43a09)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900 }}>▶</div>
            <span style={{ fontSize: 16, fontWeight: 900, fontFamily: "'DM Serif Display',serif" }}>Stream<span style={{ color: "#f43a09" }}>Vault</span></span>
          </Link>
          <span style={{ color: "#334155" }}>›</span>
          <Link href={`/${type}/${id}`} style={{ color: "#94a3b8", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 300 }}>{title}</Link>
          <span style={{ color: "#334155" }}>›</span>
          <span style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 700 }}>
            {type === "tv" ? `S${season} E${episode}` : "Full Movie"}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#64748b" }}>Server:</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: currentPlayer.color }}>{currentPlayer.name}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 0, height: "calc(100vh - 54px)" }}>

          {/* ── Video player ── */}
          <div style={{ background: "#000", position: "relative", display: "flex", flexDirection: "column" }}>

            {/* Player iframe */}
            <div style={{ flex: 1, position: "relative", background: "#000" }}>
              {loading && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#000", zIndex: 5, flexDirection: "column", gap: 16 }}>
                  <div style={{ width: 48, height: 48, border: "3px solid rgba(244,58,9,0.2)", borderTop: "3px solid #f43a09", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  <p style={{ color: "#64748b", fontSize: 13 }}>Loading {currentPlayer.name}…</p>
                </div>
              )}
              <iframe
                key={`${player}-${season}-${episode}`}
                src={embedUrl}
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
                onLoad={() => setLoading(false)}
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              />
            </div>

            {/* Player switcher bar */}
            <div style={{ background: "#0c0e12", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "10px 16px" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ color: "#64748b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginRight: 4 }}>Player:</span>
                {PLAYERS.map((p, i) => (
                  <button key={p.id} onClick={() => { setPlayer(i); setLoading(true); }}
                    style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${player === i ? p.color : "rgba(255,255,255,0.08)"}`, background: player === i ? `${p.color}20` : "rgba(255,255,255,0.04)", color: player === i ? p.color : "#64748b", fontSize: 12, fontWeight: 700, transition: "all 0.2s", cursor: "pointer" }}>
                    {p.name}
                    <span style={{ display: "block", fontSize: 9, fontWeight: 400, opacity: 0.7, marginTop: 1 }}>{p.note}</span>
                  </button>
                ))}
              </div>
              <p style={{ color: "#334155", fontSize: 11, marginTop: 8 }}>
                If one player doesn't work, try another. Use Smashy for dubbed. 2Embed for subtitles.
              </p>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div style={{ background: "#0c0e12", borderLeft: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Item info */}
            <div style={{ padding: 16, borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 12 }}>
              <img src={poster} alt={title} style={{ width: 52, borderRadius: 8, objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).src = "/placeholder-poster.jpg"; }} />
              <div>
                <p style={{ fontWeight: 800, fontSize: 14, color: "#f1f5f9", lineHeight: 1.3, marginBottom: 4 }}>{title}</p>
                <p style={{ color: "#64748b", fontSize: 12 }}>
                  {item?.vote_average ? `★ ${Number(item.vote_average).toFixed(1)}` : ""}{" "}
                  {(item?.release_date ?? item?.first_air_date ?? "").slice(0, 4)}
                </p>
              </div>
            </div>

            {/* TV Episode Selector */}
            {type === "tv" && (
              <div style={{ padding: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ color: "#64748b", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10 }}>Season</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                  {Array.from({ length: totalSeasons }, (_, i) => i + 1).map(s => (
                    <button key={s} onClick={() => { setSeason(s); setEpisode(1); setLoading(true); }}
                      style={{ width: 34, height: 34, borderRadius: 8, fontSize: 13, fontWeight: 700, border: `1px solid ${season === s ? "#f43a09" : "rgba(255,255,255,0.1)"}`, background: season === s ? "#f43a09" : "rgba(255,255,255,0.05)", color: season === s ? "#fff" : "#64748b" }}>
                      {s}
                    </button>
                  ))}
                </div>
                <p style={{ color: "#64748b", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10 }}>Episode</p>
                <div className="hide-scrollbar" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, maxHeight: 200, overflowY: "auto" }}>
                  {Array.from({ length: Math.min(totalEpisodes, 50) }, (_, i) => i + 1).map(ep => (
                    <button key={ep} onClick={() => { setEpisode(ep); setLoading(true); }}
                      style={{ height: 32, borderRadius: 7, fontSize: 12, fontWeight: 700, border: `1px solid ${episode === ep ? "#68d388" : "rgba(255,255,255,0.08)"}`, background: episode === ep ? "rgba(104,211,136,0.2)" : "rgba(255,255,255,0.04)", color: episode === ep ? "#68d388" : "#64748b" }}>
                      {ep}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Free streaming sources info */}
            <div style={{ padding: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ color: "#64748b", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10 }}>Subtitle & Dubbed Options</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { name: "VidSrc", note: "English subtitles, HD", color: "#f43a09" },
                  { name: "AutoEmbed", note: "Multi-language subtitles", color: "#68d388" },
                  { name: "2Embed", note: "SRT subtitles embedded", color: "#c2edda" },
                  { name: "Smashy", note: "Hindi/Urdu dubbed", color: "#a78bfa" },
                  { name: "MultiEmbed", note: "Multiple audio tracks", color: "#fb7185" },
                ].map(s => (
                  <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.name}</span>
                    <span style={{ fontSize: 11, color: "#64748b" }}>{s.note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Report / tips */}
            <div style={{ padding: 14, marginTop: "auto" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 12 }}>
                <p style={{ color: "#64748b", fontSize: 11, lineHeight: 1.65, marginBottom: 8 }}>
                  💡 <strong style={{ color: "#94a3b8" }}>Tips:</strong> If video doesn't load, disable your ad blocker or try a different player above.
                </p>
                <p style={{ color: "#64748b", fontSize: 11, lineHeight: 1.65 }}>
                  🌐 <strong style={{ color: "#94a3b8" }}>VPN:</strong> If content is blocked in your region, use a free VPN.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const type = params?.type as string;
  const id   = parseInt(params?.id as string);
  if (!["movie", "tv"].includes(type) || isNaN(id)) return { notFound: true };
  try {
    const item = type === "tv" ? await tmdb.tvDetail(id) : await tmdb.movieDetail(id);
    if (!item?.id) return { notFound: true };
    return { props: { item, type, id } };
  } catch { return { notFound: true }; }
};

export default WatchPage;
