import { useState, useEffect } from "react";
import Link from "next/link";

const ACCENTS = [
  { a: "#c2edda", g: "linear-gradient(135deg,#3a9e7a,#c2edda)", dark: true },
  { a: "#f43a09", g: "linear-gradient(135deg,#c4290a,#f43a09)", dark: false },
  { a: "#68d388", g: "linear-gradient(135deg,#2e8b4a,#68d388)", dark: false },
  { a: "#ffb766", g: "linear-gradient(135deg,#c4700a,#ffb766)", dark: true },
  { a: "#a78bfa", g: "linear-gradient(135deg,#6d4bc4,#a78bfa)", dark: false },
  { a: "#f43a09", g: "linear-gradient(135deg,#c4290a,#f43a09)", dark: false },
];

export default function Hero({ items }: { items: any[] }) {
  const [cur, setCur] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!items.length) return;
    const t = setTimeout(() => {
      setFade(true);
      setTimeout(() => { setCur(c => (c + 1) % Math.min(items.length, 6)); setFade(false); }, 400);
    }, 7000);
    return () => clearTimeout(t);
  }, [cur, items.length]);

  if (!items.length) return (
    <div style={{ height: "88vh", background: "#0c0e12", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" as const, gap: 16 }}>
      <div style={{ fontSize: 72 }}>🎬</div>
      <p style={{ color: "#334155", fontSize: 17, textAlign: "center" as const, maxWidth: 340, lineHeight: 1.65 }}>
        Add <code style={{ color: "#f43a09" }}>TMDB_API_KEY</code> to .env.local to load movies
      </p>
    </div>
  );

  const item  = items[cur] ?? items[0];
  const ac    = ACCENTS[cur % ACCENTS.length];
  const title = item?.title ?? item?.name ?? "Untitled";
  const year  = (item?.release_date ?? item?.first_air_date ?? "").slice(0, 4);
  const type  = item?.media_type === "tv" ? "tv" : "movie";
  const rate  = item?.vote_average ? Number(item.vote_average).toFixed(1) : "—";
  const bdUrl = item?.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null;

  return (
    <div style={{ position: "relative", height: "92vh", overflow: "hidden", background: "#0c0e12" }}>
      {bdUrl && (
        <img src={bdUrl} alt="" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3) saturate(1.2)", opacity: fade ? 0 : 1, transition: "opacity 0.42s ease", pointerEvents: "none" }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(140deg,${ac.a}22,transparent 55%)` }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,rgba(12,14,18,0.97) 32%,rgba(12,14,18,0.55) 62%,transparent 95%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(12,14,18,1),transparent 45%)" }} />

      <div style={{ position: "absolute", left: 60, top: "50%", transform: "translateY(-52%)", maxWidth: 560, opacity: fade ? 0 : 1, transition: "opacity 0.42s" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 18, alignItems: "center", flexWrap: "wrap" as const }}>
          <span style={{ background: ac.g, color: ac.dark ? "#0c0e12" : "#fff", fontSize: 10, fontWeight: 900, padding: "4px 14px", borderRadius: 20, letterSpacing: "2px", textTransform: "uppercase" as const }}>
            FEATURED
          </span>
          <span style={{ background: "rgba(255,255,255,0.08)", color: "#e2e8f0", fontSize: 11, padding: "3px 12px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.12)" }}>
            {type === "tv" ? "Series" : "Film"}{year ? ` · ${year}` : ""}
          </span>
        </div>

        <h1 style={{ margin: "0 0 10px", fontSize: "clamp(28px,4.5vw,64px)", fontWeight: 900, fontFamily: "'DM Serif Display',serif", color: "#fff", lineHeight: 1.06, textShadow: "0 2px 30px rgba(0,0,0,0.8)" }}>
          {title}
        </h1>

        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
          <span style={{ color: "#fbbf24", fontSize: 15, fontWeight: 800 }}>★ {rate}</span>
          {year && <span style={{ color: "#64748b", fontSize: 14 }}>{year}</span>}
          <span style={{ color: "#334155", fontSize: 12, border: "1px solid #334155", padding: "1px 8px", borderRadius: 4 }}>4K</span>
        </div>

        <p style={{ margin: "0 0 28px", fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, maxWidth: 440 }}>
          {item?.overview ? item.overview.slice(0, 180) + (item.overview.length > 180 ? "…" : "") : "Discover this title on StreamVault."}
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
          <Link href={`/watch/${type}/${item?.id}`}
            style={{ background: ac.g, color: ac.dark ? "#0c0e12" : "#fff", padding: "13px 30px", borderRadius: 10, fontSize: 14, fontWeight: 800, display: "inline-block", boxShadow: `0 0 28px ${ac.a}55` }}>
            ▶ Watch Now
          </Link>
          <Link href={`/${type}/${item?.id}`}
            style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${ac.a}40`, color: "#e2e8f0", padding: "13px 22px", borderRadius: 10, fontSize: 14, fontWeight: 600, display: "inline-block" }}>
            ℹ More Info
          </Link>
        </div>
      </div>

      {/* Thumbnail strip */}
      {items.length > 1 && (
        <div style={{ position: "absolute", right: 48, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column" as const, gap: 10 }}>
          {items.slice(0, 6).map((s, i) => {
            const tAc  = ACCENTS[i % ACCENTS.length];
            const tUrl = s?.backdrop_path ? `https://image.tmdb.org/t/p/w300${s.backdrop_path}` : null;
            return (
              <div key={i} onClick={() => setCur(i)}
                style={{ width: 96, height: 62, borderRadius: 10, overflow: "hidden", cursor: "pointer", opacity: i === cur ? 1 : 0.35, border: `2px solid ${i === cur ? tAc.a : "transparent"}`, boxShadow: i === cur ? `0 0 16px ${tAc.a}80` : "none", transform: i === cur ? "scale(1.06)" : "scale(1)", transition: "all 0.3s", background: "#181c24", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {tUrl ? <img src={tUrl} alt="" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 20 }}>🎬</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Dots */}
      <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7 }}>
        {items.slice(0, 6).map((_, i) => (
          <button key={i} onClick={() => setCur(i)}
            style={{ width: i === cur ? 32 : 7, height: 7, borderRadius: 4, border: "none", background: i === cur ? ac.a : "rgba(255,255,255,0.2)", cursor: "pointer", transition: "all 0.35s", padding: 0, boxShadow: i === cur ? `0 0 10px ${ac.a}` : "none" }} />
        ))}
      </div>
    </div>
  );
}
