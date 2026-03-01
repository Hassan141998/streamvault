/**
 * components/MovieCard.tsx
 */
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { tmdbImg } from "../lib/tmdb";

const PALETTE = ["#f43a09","#ffb766","#68d388","#c2edda","#a78bfa","#f43a09","#68d388","#ffb766"];

export default function MovieCard({ item, mediaType }: { item: any; mediaType: "movie"|"tv" }) {
  const [hov, setHov] = useState(false);
  const title   = item.title ?? item.name;
  const year    = (item.release_date ?? item.first_air_date ?? "").slice(0, 4);
  const rating  = item.vote_average?.toFixed(1);
  const poster  = tmdbImg.poster(item.poster_path, "w342");
  const country = item.origin_country?.[0] ?? item.original_language?.toUpperCase() ?? "";
  const ac      = PALETTE[(item.id ?? 0) % PALETTE.length];
  const href    = `/${mediaType}/${item.id}`;

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block" }}>
      <div
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ width: "100%", paddingBottom: "150%", position: "relative", borderRadius: 14, overflow: "hidden", cursor: "pointer", transform: hov ? "scale(1.09) translateY(-9px)" : "scale(1)", transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: hov ? `0 22px 48px ${ac}44,0 0 0 1.5px ${ac}` : "0 4px 18px rgba(0,0,0,0.6)", zIndex: hov ? 10 : 1 }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Image src={poster} alt={title} fill style={{ objectFit: "cover", filter: hov ? "brightness(0.48) saturate(1.1)" : "brightness(0.8)", transition: "filter 0.3s" }} />
        </div>

        {/* Country/lang chip */}
        {country && (
          <span style={{ position: "absolute", top: 9, left: 9, background: `${ac}dd`, color: ac === "#ffb766" || ac === "#c2edda" ? "#0c0e12" : "#fff", fontSize: 9, fontWeight: 900, padding: "2px 8px", borderRadius: 6, letterSpacing: "0.8px", textTransform: "uppercase" as const }}>
            {country}
          </span>
        )}

        <div style={{ position: "absolute", inset: 0, background: hov ? "linear-gradient(to top,rgba(12,14,18,1) 0%,rgba(12,14,18,0.78) 46%,transparent 100%)" : "linear-gradient(to top,rgba(12,14,18,0.94) 0%,transparent 52%)", transition: "all 0.3s", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 12 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#f1f5f9", fontFamily: "'DM Serif Display',serif", lineHeight: 1.3 }}>{title}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 5 }}>
            <span style={{ color: "#fbbf24", fontSize: 12, fontWeight: 800 }}>★ {rating}</span>
            <span style={{ color: "#64748b", fontSize: 11 }}>{year}</span>
            <span style={{ color: "#334155", fontSize: 11 }}>{mediaType === "tv" ? "Series" : "Film"}</span>
          </div>
          {hov && (
            <div style={{ marginTop: 10, animation: "slideUp 0.2s ease" }}>
              <div style={{ width: "100%", background: ac, border: "none", color: ac === "#ffb766" || ac === "#c2edda" ? "#0c0e12" : "#fff", padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer", letterSpacing: "0.4px", textAlign: "center", boxShadow: `0 0 16px ${ac}66` }}>
                ▶ Watch Now
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
