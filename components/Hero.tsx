import { useState, useEffect } from "react";
import Link from "next/link";

const ACCENTS = [
  { a:"#c2edda", d:"#3a9e7a", g:"linear-gradient(135deg,#3a9e7a,#c2edda)", light:true  },
  { a:"#f43a09", d:"#c4290a", g:"linear-gradient(135deg,#c4290a,#f43a09)", light:false },
  { a:"#68d388", d:"#2e8b4a", g:"linear-gradient(135deg,#2e8b4a,#68d388)", light:false },
  { a:"#ffb766", d:"#c4700a", g:"linear-gradient(135deg,#c4700a,#ffb766)", light:true  },
  { a:"#c2edda", d:"#3a9e7a", g:"linear-gradient(135deg,#3a9e7a,#c2edda)", light:true  },
  { a:"#f43a09", d:"#c4290a", g:"linear-gradient(135deg,#c4290a,#f43a09)", light:false },
];
const BADGES = ["FEATURED","TOP RATED","TRENDING","NOW STREAMING","CLASSIC","POPULAR"];

export default function Hero({ items }: { items: any[] }) {
  const [cur,  setCur]  = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!items.length) return;
    const t = setTimeout(() => {
      setFade(true);
      setTimeout(() => { setCur(c => (c + 1) % items.length); setFade(false); }, 380);
    }, 7000);
    return () => clearTimeout(t);
  }, [cur, items.length]);

  if (!items.length) return (
    <div style={{ height:"90vh", background:"#0c0e12", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" as const, gap:16 }}>
      <div style={{ fontSize:80 }}>🎬</div>
      <p style={{ color:"#334155", fontSize:18, textAlign:"center" as const, maxWidth:360, lineHeight:1.65 }}>
        Add <code style={{ color:"#f43a09" }}>TMDB_API_KEY</code> to .env.local to see movies
      </p>
    </div>
  );

  const item  = items[cur];
  const ac    = ACCENTS[cur % ACCENTS.length];
  const title = item?.title ?? item?.name ?? "Untitled";
  const year  = (item?.release_date ?? item?.first_air_date ?? "").slice(0, 4);
  const type  = item?.media_type === "tv" ? "tv" : "movie";
  const rate  = item?.vote_average ? Number(item.vote_average).toFixed(1) : "—";
  const bdUrl = item?.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : null;

  return (
    <div style={{ position:"relative", height:"92vh", overflow:"hidden", background:"#0c0e12" }}>
      {/* Backdrop */}
      {bdUrl && (
        <img src={bdUrl} alt="" onError={e=>{(e.target as HTMLImageElement).style.display="none"}}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
            filter:"brightness(0.3) saturate(1.2)", opacity:fade?0:1, transition:"opacity 0.42s ease", pointerEvents:"none" }} />
      )}
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(140deg,${ac.d}33,transparent 55%)` }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(12,14,18,0.97) 32%,rgba(12,14,18,0.55) 62%,transparent 95%)" }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(12,14,18,1),transparent 42%)" }} />

      {/* Content */}
      <div style={{ position:"absolute", left:60, top:"50%", transform:"translateY(-50%)", maxWidth:580, opacity:fade?0:1, transition:"opacity 0.42s" }}>
        <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" as const, alignItems:"center" }}>
          <span style={{ background:ac.g, color:ac.light?"#0c0e12":"#fff", fontSize:10, fontWeight:900,
            padding:"4px 14px", borderRadius:20, letterSpacing:"2px", textTransform:"uppercase" as const }}>
            {BADGES[cur % BADGES.length]}
          </span>
          <span style={{ background:"rgba(255,255,255,0.08)", color:"#e2e8f0", fontSize:11, padding:"3px 12px", borderRadius:20, border:"1px solid rgba(255,255,255,0.12)" }}>
            {type==="tv"?"Series":"Film"}{year?` · ${year}`:""}
          </span>
        </div>

        <h1 style={{ margin:"0 0 10px", fontSize:"clamp(30px,5vw,68px)", fontWeight:900,
          fontFamily:"'DM Serif Display',serif", color:"#fff", lineHeight:1.06, textShadow:"0 2px 30px rgba(0,0,0,0.8)" }}>
          {title}
        </h1>

        <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:18 }}>
          <span style={{ color:"#fbbf24", fontSize:15, fontWeight:800 }}>★ {rate}</span>
          {year && <span style={{ color:"#64748b", fontSize:14 }}>{year}</span>}
          <span style={{ color:"#334155", fontSize:13 }}>4K HDR</span>
        </div>

        <p style={{ margin:"0 0 30px", fontSize:14.5, color:"#cbd5e1", lineHeight:1.78, maxWidth:440 }}>
          {item?.overview ? item.overview.slice(0,200) + (item.overview.length>200?"…":"") : "Discover this title on StreamVault."}
        </p>

        <div style={{ display:"flex", gap:10, flexWrap:"wrap" as const }}>
          <Link href={`/${type}/${item?.id}`}
            style={{ background:ac.g, color:ac.light?"#0c0e12":"#fff", padding:"13px 32px", borderRadius:10,
              fontSize:14, fontWeight:800, display:"inline-block",
              boxShadow:`0 0 28px ${ac.a}55,0 8px 20px rgba(0,0,0,0.4)` }}>
            ▶ Watch Now
          </Link>
          <button style={{ background:"rgba(255,255,255,0.08)", border:`1px solid ${ac.a}40`, color:"#e2e8f0",
            padding:"13px 24px", borderRadius:10, fontSize:14, fontWeight:600 }}>
            + My List
          </button>
        </div>
      </div>

      {/* Thumbnail strip */}
      {items.length > 1 && (
        <div style={{ position:"absolute", right:48, top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column" as const, gap:10 }}>
          {items.slice(0,6).map((s,i) => {
            const tAc  = ACCENTS[i%ACCENTS.length];
            const tUrl = s?.backdrop_path ? `https://image.tmdb.org/t/p/w300${s.backdrop_path}` : null;
            return (
              <div key={i} onClick={()=>setCur(i)}
                style={{ width:100, height:64, borderRadius:10, overflow:"hidden", cursor:"pointer",
                  opacity:i===cur?1:0.38, border:`2px solid ${i===cur?tAc.a:"transparent"}`,
                  boxShadow:i===cur?`0 0 18px ${tAc.a}80`:"none",
                  transform:i===cur?"scale(1.06)":"scale(1)", transition:"all 0.3s",
                  background:"#181c24", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {tUrl
                  ? <img src={tUrl} alt="" onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <span style={{fontSize:22}}>🎬</span>
                }
              </div>
            );
          })}
        </div>
      )}

      {/* Dots */}
      <div style={{ position:"absolute", bottom:24, left:"50%", transform:"translateX(-50%)", display:"flex", gap:7 }}>
        {items.slice(0,6).map((_,i) => (
          <button key={i} onClick={()=>setCur(i)}
            style={{ width:i===cur?34:8, height:8, borderRadius:4, border:"none",
              background:i===cur?ac.a:"rgba(255,255,255,0.2)", cursor:"pointer",
              transition:"all 0.35s", boxShadow:i===cur?`0 0 10px ${ac.a}`:"none", padding:0 }} />
        ))}
      </div>
    </div>
  );
}
