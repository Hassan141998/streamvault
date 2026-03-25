import Link from "next/link";
import { useState } from "react";

const COLORS = ["#f43a09","#ffb766","#68d388","#c2edda","#a78bfa","#f43a09","#68d388","#ffb766"];

export default function Card({ item, type }: { item: any; type: "movie" | "tv" }) {
  const [hov, setHov] = useState(false);
  const title  = item?.title ?? item?.name ?? "Untitled";
  const year   = (item?.release_date ?? item?.first_air_date ?? "").slice(0, 4);
  const rating = item?.vote_average ? Number(item.vote_average).toFixed(1) : "—";
  const poster = item?.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : "/placeholder-poster.jpg";
  const ac     = COLORS[(item?.id ?? 0) % COLORS.length];
  const light  = ac === "#ffb766" || ac === "#c2edda";

  return (
    <Link href={`/${type}/${item?.id}`}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "block", borderRadius: 14, overflow: "hidden", position: "relative", aspectRatio: "2/3",
        transform: hov ? "scale(1.08) translateY(-8px)" : "scale(1)",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: hov ? `0 20px 44px ${ac}44, 0 0 0 1.5px ${ac}` : "0 4px 16px rgba(0,0,0,0.5)",
        zIndex: hov ? 10 : 1 }}>

      <img src={poster} alt={title}
        onError={e => { (e.target as HTMLImageElement).src = "/placeholder-poster.jpg"; }}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: hov ? "brightness(0.4)" : "brightness(0.82)", transition: "filter 0.3s" }} />

      {item?.origin_country?.[0] && (
        <span style={{ position: "absolute", top: 8, left: 8, background: `${ac}dd`, color: light ? "#0c0e12" : "#fff", fontSize: 8, fontWeight: 900, padding: "2px 7px", borderRadius: 5, letterSpacing: "0.8px", textTransform: "uppercase" as const }}>
          {item.origin_country[0]}
        </span>
      )}

      <div style={{ position: "absolute", inset: 0, background: hov ? "linear-gradient(to top,rgba(12,14,18,1) 0%,rgba(12,14,18,0.7) 45%,transparent)" : "linear-gradient(to top,rgba(12,14,18,0.95),transparent 55%)", transition: "all 0.3s", display: "flex", flexDirection: "column" as const, justifyContent: "flex-end", padding: 10 }}>
        <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 800, color: "#f1f5f9", fontFamily: "'DM Serif Display',serif", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box" as const, WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{title}</p>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ color: "#fbbf24", fontSize: 11, fontWeight: 800 }}>★ {rating}</span>
          {year && <span style={{ color: "#64748b", fontSize: 10 }}>{year}</span>}
        </div>
        {hov && (
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column" as const, gap: 5 }}>
            <Link href={`/watch/${type}/${item?.id}`} onClick={e => e.stopPropagation()}
              style={{ display: "block", width: "100%", background: ac, color: light ? "#0c0e12" : "#fff", padding: "7px 0", borderRadius: 7, fontSize: 11, fontWeight: 800, textAlign: "center" as const, boxShadow: `0 0 14px ${ac}66` }}>
              ▶ Watch Now
            </Link>
            <Link href={`/${type}/${item?.id}`} onClick={e => e.stopPropagation()}
              style={{ display: "block", width: "100%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "5px 0", borderRadius: 7, fontSize: 10, fontWeight: 700, textAlign: "center" as const }}>
              ℹ Info
            </Link>
          </div>
        )}
      </div>
    </Link>
  );
}
