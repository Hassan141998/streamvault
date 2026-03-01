/**
 * components/MovieRow.tsx
 */
import { useRef } from "react";
import Link from "next/link";
import MovieCard from "./MovieCard";

interface Props {
  title: string;
  items: any[];
  accent?: string;
  mediaType: "movie" | "tv";
  seeAllHref?: string;
}

export default function MovieRow({ title, items, accent = "var(--orange)", mediaType, seeAllHref }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 440, behavior: "smooth" });

  if (!items.length) return null;

  return (
    <div style={{ marginBottom: 52 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, padding: "0 52px" }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#f1f5f9", fontFamily: "'DM Serif Display',serif", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 3, height: 20, background: accent, borderRadius: 2, boxShadow: `0 0 10px ${accent}`, display: "inline-block" }} />
          {title}
        </h2>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {["‹", "›"].map((ch, i) => (
            <button key={ch} onClick={() => scroll(i ? 1 : -1)}
              style={{ background: "#181c24", border: "1px solid rgba(255,255,255,0.07)", color: "#64748b", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = "#f1f5f9"; (e.target as HTMLButtonElement).style.borderColor = accent; }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = "#64748b"; (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)"; }}>
              {ch}
            </button>
          ))}
          {seeAllHref && (
            <Link href={seeAllHref} style={{ color: accent, fontSize: 12, fontWeight: 700, marginLeft: 6, textDecoration: "none" }}>See All →</Link>
          )}
        </div>
      </div>

      <div ref={ref} className="hide-scrollbar" style={{ display: "grid", gridAutoFlow: "column", gridTemplateRows: "1fr", gridAutoColumns: "178px", gap: 14, overflowX: "auto", padding: "8px 52px 16px" }}>
        {items.map(item => (
          <MovieCard key={item.id} item={item} mediaType={mediaType} />
        ))}
      </div>
    </div>
  );
}
