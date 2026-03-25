import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hints, setHints] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  useEffect(() => {
    if (query.length < 2) { setHints([]); return; }
    const t = setTimeout(() => {
      fetch(`/api/tmdb/search/multi?query=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(d => setHints((d.results ?? []).filter((r: any) => r.media_type !== "person").slice(0, 5)))
        .catch(() => {});
    }, 280);
    return () => clearTimeout(t);
  }, [query]);

  const goSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) { router.push(`/search?q=${encodeURIComponent(query.trim())}`); setQuery(""); setOpen(false); setHints([]); }
  };

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 66, padding: "0 48px", display: "flex", alignItems: "center", gap: 6,
      background: scrolled || !transparent ? "rgba(12,14,18,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled || !transparent ? "1px solid rgba(255,255,255,0.07)" : "none",
      transition: "all 0.3s" }}>

      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 32, flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#c4290a,#f43a09)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14, boxShadow: "0 0 16px rgba(244,58,9,0.5)" }}>▶</div>
        <span style={{ fontSize: 18, fontWeight: 900, color: "#f1f5f9", fontFamily: "'DM Serif Display',serif" }}>Stream<span style={{ color: "#f43a09" }}>Vault</span></span>
      </Link>

      <div style={{ display: "flex", gap: 2 }}>
        {([["Home", "/"], ["Movies", "/movies"], ["Series", "/series"], ["Dubbed", "/dubbed"]] as [string, string][]).map(([l, h]) => (
          <Link key={l} href={h} style={{ color: router.pathname === h ? "#f1f5f9" : "#64748b", fontSize: 14, fontWeight: 600, padding: "5px 12px", borderRadius: 8, borderBottom: router.pathname === h ? "2px solid #f43a09" : "2px solid transparent", transition: "all 0.2s" }}>{l}</Link>
        ))}
        <Link href="/downloads" style={{ marginLeft: 6, background: "rgba(104,211,136,0.1)", border: "1px solid rgba(104,211,136,0.25)", color: "#68d388", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 8 }}>⬇ App</Link>
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: open ? "#181c24" : "transparent", border: open ? "1px solid rgba(244,58,9,0.5)" : "1px solid transparent", borderRadius: 10, padding: open ? "7px 14px" : "7px 10px", transition: "all 0.3s", width: open ? 260 : 38, overflow: "hidden" }}>
          <span style={{ color: open ? "#f43a09" : "#64748b", fontSize: 15, cursor: "pointer", flexShrink: 0 }} onClick={() => { if (open) { setOpen(false); setQuery(""); setHints([]); } else setOpen(true); }}>🔍</span>
          <form onSubmit={goSearch} style={{ display: open ? "contents" : "none" }}>
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search movies, series…" style={{ background: "transparent", border: "none", outline: "none", color: "#f1f5f9", fontSize: 13, width: "100%", fontFamily: "inherit" }} />
          </form>
        </div>
        {hints.length > 0 && (
          <div style={{ position: "absolute", top: 48, right: 0, width: 300, background: "#13161c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, boxShadow: "0 20px 48px rgba(0,0,0,0.7)", zIndex: 300, overflow: "hidden" }}>
            {hints.map(item => {
              const title = item.title ?? item.name;
              const type  = item.media_type ?? "movie";
              const poster = item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : null;
              return (
                <Link key={item.id} href={`/${type}/${item.id}`} onClick={() => { setQuery(""); setOpen(false); setHints([]); }}
                  style={{ display: "flex", gap: 12, padding: "10px 14px", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#181c24")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  {poster ? <img src={poster} alt="" style={{ width: 32, height: 48, objectFit: "cover", borderRadius: 5, flexShrink: 0 }} /> : <div style={{ width: 32, height: 48, borderRadius: 5, background: "#181c24", flexShrink: 0 }} />}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#f1f5f9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>{type === "tv" ? "Series" : "Movie"} · {(item.release_date ?? item.first_air_date ?? "").slice(0, 4)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {session ? (
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginLeft: 8 }}>
          <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>👤 {session.user?.name?.split(" ")[0]}</span>
          <button onClick={() => signOut({ callbackUrl: "/" })} style={{ background: "none", border: "none", color: "#64748b", fontSize: 12 }}>Sign out</button>
        </div>
      ) : (
        <Link href="/auth/signin" style={{ marginLeft: 8, background: "linear-gradient(135deg,#c4290a,#f43a09)", color: "#fff", fontSize: 13, fontWeight: 700, padding: "8px 20px", borderRadius: 8, boxShadow: "0 0 18px rgba(244,58,9,0.44)", flexShrink: 0 }}>Sign In</Link>
      )}
    </nav>
  );
}
