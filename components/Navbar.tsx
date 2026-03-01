import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const [hints, setHints] = useState<any[]>([]);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { if (open) ref.current?.focus(); }, [open]);

  useEffect(() => {
    if (query.length < 2) { setHints([]); return; }
    const t = setTimeout(() => {
      fetch(`/api/tmdb/search/multi?query=${encodeURIComponent(query)}`)
        .then(r=>r.json())
        .then(d=>setHints((d.results??[]).filter((r:any)=>r.media_type!=="person").slice(0,5)))
        .catch(()=>{});
    }, 280);
    return () => clearTimeout(t);
  }, [query]);

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) { router.push(`/search?q=${encodeURIComponent(query.trim())}`); setQuery(""); setOpen(false); setHints([]); }
  };

  const nav: React.CSSProperties = {
    position:"fixed", top:0, left:0, right:0, zIndex:200, height:66,
    padding:"0 52px", display:"flex", alignItems:"center",
    background: scrolled || !transparent ? "rgba(12,14,18,0.97)" : "transparent",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    borderBottom: scrolled || !transparent ? "1px solid rgba(255,255,255,0.07)" : "none",
    transition:"all 0.3s",
  };

  return (
    <nav style={nav}>
      {/* Logo */}
      <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, marginRight:40 }}>
        <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#c4290a,#f43a09)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:14, boxShadow:"0 0 16px rgba(244,58,9,0.5)" }}>▶</div>
        <span style={{ fontSize:19, fontWeight:900, color:"#f1f5f9", fontFamily:"'DM Serif Display',serif" }}>Stream<span style={{ color:"#f43a09" }}>Vault</span></span>
      </Link>

      {/* Nav links */}
      <div style={{ display:"flex", gap:2, alignItems:"center" }}>
        {[["Home","/"],["Movies","/movies"],["Series","/series"]].map(([l,h])=>(
          <Link key={l} href={h} style={{ color:router.pathname===h?"#f1f5f9":"#64748b", fontSize:14, fontWeight:600, padding:"6px 12px", borderRadius:8, borderBottom:router.pathname===h?"2px solid #f43a09":"2px solid transparent", transition:"all 0.2s" }}>{l}</Link>
        ))}
        <Link href="/downloads" style={{ marginLeft:6, background:"rgba(104,211,136,0.1)", border:"1px solid rgba(104,211,136,0.25)", color:"#68d388", fontSize:12, fontWeight:700, padding:"5px 14px", borderRadius:8 }}>⬇ App</Link>
      </div>

      {/* Right: search + auth */}
      <div style={{ marginLeft:"auto", display:"flex", gap:10, alignItems:"center" }}>
        {/* Search */}
        <div style={{ position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:open?"#13161c":"transparent", border:open?"1px solid rgba(244,58,9,0.4)":"1px solid transparent", borderRadius:10, padding:open?"7px 14px":"7px 10px", transition:"all 0.3s", width:open?250:38, overflow:"hidden", boxShadow:open?"0 0 16px rgba(244,58,9,0.15)":"none" }}>
            <span style={{ color:open?"#f43a09":"#64748b", fontSize:15, cursor:"pointer", flexShrink:0 }} onClick={()=>{ setOpen(o=>!o); if(open){setQuery("");setHints([]);} }}>🔍</span>
            <form onSubmit={go} style={{ display:open?"contents":"none" }}>
              <input ref={ref} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search movies, series…" style={{ background:"transparent", border:"none", outline:"none", color:"#f1f5f9", fontSize:13, width:"100%" }} />
            </form>
          </div>
          {hints.length > 0 && (
            <div style={{ position:"absolute", top:46, right:0, width:280, background:"#13161c", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, boxShadow:"0 20px 48px rgba(0,0,0,0.7)", zIndex:300, overflow:"hidden" }}>
              {hints.map(item=>{
                const title = item.title??item.name;
                const poster = item.poster_path?`https://image.tmdb.org/t/p/w92${item.poster_path}`:null;
                const type   = item.media_type??"movie";
                return (
                  <Link key={item.id} href={`/${type}/${item.id}`} onClick={()=>{ setQuery(""); setOpen(false); setHints([]); }}
                    style={{ display:"flex", gap:12, padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}
                    onMouseEnter={e=>(e.currentTarget.style.background="#181c24")}
                    onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                    {poster && <img src={poster} alt="" style={{ width:32, height:48, objectFit:"cover", borderRadius:5 }} />}
                    <div>
                      <p style={{ margin:"0 0 2px", fontSize:13, fontWeight:700, color:"#f1f5f9" }}>{title}</p>
                      <p style={{ margin:0, fontSize:11, color:"#64748b" }}>{type==="tv"?"Series":"Movie"} · {(item.release_date??item.first_air_date??"").slice(0,4)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {session ? (
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span style={{ color:"#94a3b8", fontSize:13, fontWeight:600 }}>👤 {session.user?.name?.split(" ")[0]}</span>
            <button onClick={()=>signOut({callbackUrl:"/"})} style={{ background:"none", border:"none", color:"#64748b", fontSize:12, cursor:"pointer" }}>Sign out</button>
          </div>
        ) : (
          <Link href="/auth/signin" style={{ background:"linear-gradient(135deg,#c4290a,#f43a09)", color:"#fff", fontSize:13, fontWeight:700, padding:"8px 20px", borderRadius:8, boxShadow:"0 0 18px rgba(244,58,9,0.44)" }}>Sign In</Link>
        )}
      </div>
    </nav>
  );
}
