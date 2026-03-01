/**
 * components/HeroBanner.tsx
 * Auto-playing hero carousel using live TMDb data
 */
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { tmdbImg } from "../lib/tmdb";

const ACCENTS = [
  { accent: "#c2edda", dark: "#3a9e7a", gradient: "linear-gradient(135deg,#3a9e7a,#c2edda)" },
  { accent: "#f43a09", dark: "#c4290a", gradient: "linear-gradient(135deg,#c4290a,#f43a09)" },
  { accent: "#68d388", dark: "#3aad5e", gradient: "linear-gradient(135deg,#3aad5e,#68d388)" },
  { accent: "#ffb766", dark: "#d4834a", gradient: "linear-gradient(135deg,#d4834a,#ffb766)" },
  { accent: "#c2edda", dark: "#3a9e7a", gradient: "linear-gradient(135deg,#3a9e7a,#c2edda)" },
  { accent: "#f43a09", dark: "#c4290a", gradient: "linear-gradient(135deg,#c4290a,#f43a09)" },
];

export default function HeroBanner({ items }: { items: any[] }) {
  const [cur, setCur] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setFade(true);
      setTimeout(() => { setCur(c => (c + 1) % items.length); setFade(false); }, 360);
    }, 7000);
    return () => clearTimeout(t);
  }, [cur, items.length]);

  if (!items.length) return null;

  const item   = items[cur];
  const ac     = ACCENTS[cur % ACCENTS.length];
  const title  = item.title ?? item.name;
  const year   = (item.release_date ?? item.first_air_date ?? "").slice(0, 4);
  const type   = item.media_type === "tv" ? "tv" : "movie";
  const rating = item.vote_average?.toFixed(1);

  return (
    <div style={{ position: "relative", height: "93vh", overflow: "hidden" }}>
      {/* Backdrop */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Image
          src={tmdbImg.backdrop(item.backdrop_path, "original")}
          alt={title} fill priority
          style={{ objectFit: "cover", filter: "brightness(0.35) saturate(1.2)", opacity: fade ? 0 : 1, transition: "opacity 0.45s ease" }}
        />
      </div>

      {/* Color wash */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(140deg,${ac.dark}44 0%,transparent 50%)`, opacity: fade ? 0 : 1, transition: "opacity 0.45s" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,rgba(12,14,18,0.97) 32%,rgba(12,14,18,0.55) 60%,transparent 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(12,14,18,1) 0%,transparent 38%)" }} />

      {/* Content */}
      <div style={{ position: "absolute", left: 60, top: "50%", transform: "translateY(-50%)", maxWidth: 570, opacity: fade ? 0 : 1, transition: "opacity 0.45s ease" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ background: ac.gradient, color: ac.accent === "#ffb766" || ac.accent === "#c2edda" ? "#0c0e12" : "#fff", fontSize: 10, fontWeight: 900, padding: "4px 12px", borderRadius: 20, letterSpacing: "2px", textTransform: "uppercase" as const }}>
            {cur === 0 ? "FEATURED" : cur === 1 ? "TOP RATED" : cur === 2 ? "TRENDING" : "NOW STREAMING"}
          </span>
          <span style={{ background: "rgba(255,255,255,0.08)", color: "#e2e8f0", fontSize: 11, padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.12)" }}>
            {type === "tv" ? "Series" : "Film"} · {year}
          </span>
        </div>

        <h1 style={{ margin: "0 0 6px", fontSize: "clamp(38px,5.2vw,70px)", fontWeight: 900, fontFamily: "'DM Serif Display',serif", color: "#fff", lineHeight: 1.06, textShadow: `0 0 60px ${ac.accent}28,0 2px 30px rgba(0,0,0,0.8)` }}>{title}</h1>
        <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 18 }}>
          <span style={{ color: "#fbbf24", fontSize: 15, fontWeight: 800 }}>★ {rating}</span>
          <span style={{ color: "#64748b", fontSize: 13 }}>{year}</span>
          <span style={{ color: "#334155", fontSize: 13 }}>· 4K HDR</span>
          <div style={{ height: 2, width: 36, background: `linear-gradient(90deg,${ac.accent},transparent)`, borderRadius: 2 }} />
        </div>

        <p style={{ margin: "0 0 30px", fontSize: 14.5, color: "#cbd5e1", lineHeight: 1.78, maxWidth: 430 }}>
          {item.overview?.slice(0, 200)}{item.overview?.length > 200 ? "…" : ""}
        </p>

        <div style={{ display: "flex", gap: 11, flexWrap: "wrap" }}>
          <Link href={`/${type}/${item.id}`} style={{ background: ac.gradient, border: "none", color: ac.accent === "#ffb766" || ac.accent === "#c2edda" ? "#0c0e12" : "#fff", padding: "13px 32px", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: "pointer", textDecoration: "none", boxShadow: `0 0 28px ${ac.accent}55,0 8px 20px rgba(0,0,0,0.4)`, display: "inline-block" }}>
            ▶ Watch Now
          </Link>
          <Link href={`/${type}/${item.id}`} style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${ac.accent}40`, color: "#e2e8f0", padding: "13px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-block" }}>
            + My List
          </Link>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div style={{ position: "absolute", right: 48, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 10 }}>
        {items.slice(0, 6).map((s, i) => (
          <div key={i} onClick={() => setCur(i)}
            style={{ width: 100, height: 64, borderRadius: 10, overflow: "hidden", cursor: "pointer", opacity: i === cur ? 1 : 0.4, border: `2px solid ${i === cur ? ACCENTS[i % ACCENTS.length].accent : "transparent"}`, boxShadow: i === cur ? `0 0 18px ${ACCENTS[i % ACCENTS.length].accent}80` : "none", transform: i === cur ? "scale(1.06)" : "scale(1)", transition: "all 0.3s" }}>
            <Image src={tmdbImg.backdrop(s.backdrop_path, "w780")} alt="" width={100} height={64} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7 }}>
        {items.slice(0, 6).map((_, i) => (
          <button key={i} onClick={() => setCur(i)}
            style={{ width: i === cur ? 34 : 8, height: 8, borderRadius: 4, padding: 0, border: "none", background: i === cur ? ac.accent : "rgba(255,255,255,0.2)", cursor: "pointer", transition: "all 0.35s", boxShadow: i === cur ? `0 0 10px ${ac.accent}` : "none" }} />
        ))}
      </div>
    </div>
  );
}
