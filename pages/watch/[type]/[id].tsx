import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { tmdb } from "../../../lib/tmdb";

const PL = [
  { id: "vidsrc",    n: "VidSrc",     c: "#f43a09", t: "Best quality" },
  { id: "vidsrc2",   n: "VidSrc 2",   c: "#ffb766", t: "Backup" },
  { id: "autoembed", n: "AutoEmbed",  c: "#68d388", t: "Multi-lang subs" },
  { id: "2embed",    n: "2Embed",     c: "#c2edda", t: "SRT subtitles" },
  { id: "smashy",    n: "Smashy",     c: "#a78bfa", t: "Hindi/Urdu dubbed" },
  { id: "multi",     n: "MultiEmbed", c: "#fb7185", t: "Multi audio" },
];

function eUrl(pid: string, type: string, id: number, s: number, ep: number): string {
  const m = type === "movie";
  const map: Record<string, string> = {
    vidsrc:    m ? "https://vidsrc.to/embed/movie/" + id : "https://vidsrc.to/embed/tv/" + id + "/" + s + "/" + ep,
    vidsrc2:   m ? "https://vidsrc.xyz/embed/movie?tmdb=" + id : "https://vidsrc.xyz/embed/tv?tmdb=" + id + "&season=" + s + "&episode=" + ep,
    autoembed: m ? "https://player.autoembed.cc/embed/movie/" + id : "https://player.autoembed.cc/embed/tv/" + id + "/" + s + "/" + ep,
    "2embed":  m ? "https://www.2embed.cc/embed/" + id : "https://www.2embed.cc/embedtv/" + id + "&s=" + s + "&e=" + ep,
    smashy:    m ? "https://embed.smashystream.com/playere.php?tmdb=" + id : "https://embed.smashystream.com/playere.php?tmdb=" + id + "&season=" + s + "&episode=" + ep,
    multi:     m ? "https://multiembed.mov/directstream.php?video_id=" + id + "&tmdb=1" : "https://multiembed.mov/directstream.php?video_id=" + id + "&tmdb=1&s=" + s + "&e=" + ep,
  };
  return map[pid] || map["vidsrc"];
}

const WatchPage: NextPage<{ item: any; type: string; id: number }> = ({ item, type, id }) => {
  const [player,  setPlayer]  = useState("vidsrc");
  const [season,  setSeason]  = useState(1);
  const [episode, setEpisode] = useState(1);
  const [loading, setLoading] = useState(true);

  const title  = item?.title ?? item?.name ?? "Unknown";
  const poster = item?.poster_path ? "https://image.tmdb.org/t/p/w92" + item.poster_path : "/placeholder-poster.jpg";
  const totalSeasons = item?.number_of_seasons ?? 1;
  const epCount      = item?.seasons?.find((s: any) => s.season_number === season)?.episode_count ?? 20;
  const cur = PL.find(p => p.id === player) || PL[0];

  return (
    <>
      <Head>
        <title>Watch {title} — StreamVault</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{ minHeight: "100vh", background: "#080b0f", color: "#f1f5f9" }}>
        <div style={{ height: 54, background: "rgba(12,14,18,.98)", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", padding: "0 20px", gap: 14, position: "sticky", top: 0, zIndex: 100 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#c4290a,#f43a09)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900 }}>▶</div>
            <span style={{ fontSize: 16, fontWeight: 900, fontFamily: "serif" }}>Stream<span style={{ color: "#f43a09" }}>Vault</span></span>
          </Link>
          <span style={{ color: "#334155" }}>›</span>
          <Link href={"/" + type + "/" + id} style={{ color: "#94a3b8", fontSize: 13 }}>{title}</Link>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#64748b" }}>Server:</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: cur.c }}>{cur.n}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", height: "calc(100vh - 54px)" }}>
          <div style={{ background: "#000", display: "flex", flexDirection: "column" as const }}>
            <div style={{ flex: 1, position: "relative" }}>
              {loading && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#000", zIndex: 5, flexDirection: "column" as const, gap: 14 }}>
                  <div style={{ width: 48, height: 48, border: "3px solid rgba(244,58,9,.2)", borderTop: "3px solid #f43a09", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                  <p style={{ color: "#64748b", fontSize: 13 }}>Loading {cur.n}...</p>
                </div>
              )}
              <iframe
                key={player + "-" + season + "-" + episode}
                src={eUrl(player, type, id, season, episode)}
                allowFullScreen
                allow="autoplay; fullscreen"
                onLoad={() => setLoading(false)}
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              />
            </div>
            <div style={{ background: "#0c0e12", borderTop: "1px solid rgba(255,255,255,.07)", padding: "10px 16px" }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, alignItems: "center" }}>
                <span style={{ color: "#64748b", fontSize: 11, fontWeight: 700 }}>Player:</span>
                {PL.map(p => (
                  <button key={p.id} onClick={() => { setPlayer(p.id); setLoading(true); }}
                    style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid " + (player === p.id ? p.c : "rgba(255,255,255,.08)"), background: player === p.id ? p.c + "20" : "rgba(255,255,255,.04)", color: player === p.id ? p.c : "#64748b", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                    {p.n}
                  </button>
                ))}
              </div>
              <p style={{ color: "#334155", fontSize: 10, marginTop: 6 }}>Smashy = Hindi/Urdu dubbed. 2Embed = subtitles.</p>
            </div>
          </div>

          <div style={{ background: "#0c0e12", borderLeft: "1px solid rgba(255,255,255,.07)", display: "flex", flexDirection: "column" as const, overflow: "hidden" }}>
            <div style={{ padding: 14, borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", gap: 10 }}>
              <img src={poster} alt={title} style={{ width: 48, borderRadius: 8, objectFit: "cover" }}
                onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-poster.jpg"; }} />
              <div>
                <p style={{ fontWeight: 800, fontSize: 13, color: "#f1f5f9", marginBottom: 3 }}>{title}</p>
                <p style={{ color: "#64748b", fontSize: 12 }}>
                  {type === "tv" ? "S" + season + "E" + episode : "Full Movie"}
                </p>
              </div>
            </div>

            {type === "tv" && (
              <div style={{ padding: 14, overflowY: "auto" as const }}>
                <p style={{ color: "#64748b", fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, marginBottom: 8 }}>Season</p>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const, marginBottom: 12 }}>
                  {Array.from({ length: totalSeasons }, (_, i) => i + 1).map(s => (
                    <button key={s} onClick={() => { setSeason(s); setEpisode(1); setLoading(true); }}
                      style={{ width: 32, height: 32, borderRadius: 7, fontSize: 12, fontWeight: 700, border: "1px solid " + (season === s ? "#f43a09" : "rgba(255,255,255,.1)"), background: season === s ? "#f43a09" : "rgba(255,255,255,.05)", color: season === s ? "#fff" : "#64748b" }}>
                      {s}
                    </button>
                  ))}
                </div>
                <p style={{ color: "#64748b", fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, marginBottom: 8 }}>Episode</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 5 }}>
                  {Array.from({ length: Math.min(epCount, 50) }, (_, i) => i + 1).map(ep => (
                    <button key={ep} onClick={() => { setEpisode(ep); setLoading(true); }}
                      style={{ height: 30, borderRadius: 6, fontSize: 11, fontWeight: 700, border: "1px solid " + (episode === ep ? "#68d388" : "rgba(255,255,255,.08)"), background: episode === ep ? "rgba(104,211,136,.2)" : "rgba(255,255,255,.04)", color: episode === ep ? "#68d388" : "#64748b" }}>
                      {ep}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
