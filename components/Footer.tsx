import Link from "next/link";

const COLS: [string, [string,string][]][] = [
  ["Explore",  [["Movies","/movies"],["TV Series","/series"],["Bollywood","/discover?region=Bollywood"],["Turkish","/discover?region=Turkish"],["French","/discover?region=French"]]],
  ["Genres",   [["Action","#"],["Drama","#"],["Comedy","#"],["Sci-Fi","#"],["Thriller","#"]]],
  ["Company",  [["About","/about"],["Careers","#"],["Blog","#"],["Contact","/contact"]]],
  ["Support",  [["Help","#"],["Privacy","#"],["Terms","#"],["DMCA","#"]]],
];

export default function Footer() {
  return (
    <footer style={{ background:"#13161c", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ height:3, background:"linear-gradient(90deg,#f43a09,#ffb766,#68d388,#c2edda,#f43a09)" }} />
      <div style={{ padding:"48px 52px 28px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap:36, marginBottom:40 }}>
          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#c4290a,#f43a09)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14, fontWeight:900 }}>▶</div>
              <span style={{ fontSize:19, fontWeight:900, color:"#f1f5f9", fontFamily:"'DM Serif Display',serif" }}>Stream<span style={{ color:"#f43a09" }}>Vault</span></span>
            </div>
            <p style={{ color:"#334155", fontSize:13, lineHeight:1.7, marginBottom:18, maxWidth:240 }}>Premium destination for Hollywood, Bollywood, Turkish & French content in 4K HDR.</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" as const }}>
              {[["🤖","#68d388","Android"],["🪟","#f43a09","Windows"],["🍎","#ffb766","macOS"]].map(([icon,color,label])=>(
                <Link key={label} href="/downloads" style={{ background:`${color}12`, border:`1px solid ${color}28`, color, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:7, display:"inline-flex", alignItems:"center", gap:4 }}>{icon} {label}</Link>
              ))}
            </div>
          </div>
          {/* Columns */}
          {COLS.map(([h,links])=>(
            <div key={h}>
              <p style={{ margin:"0 0 16px", color:"#f1f5f9", fontSize:11, fontWeight:800, textTransform:"uppercase" as const, letterSpacing:"1.5px" }}>{h}</p>
              {links.map(([l,href])=>(
                <p key={l} style={{ margin:"0 0 9px" }}>
                  <Link href={href} style={{ color:"#64748b", fontSize:13 }}
                    onMouseEnter={e=>(e.currentTarget.style.color="#f43a09")}
                    onMouseLeave={e=>(e.currentTarget.style.color="#64748b")}>{l}</Link>
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{ background:"#181c24", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"22px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, marginBottom:32, flexWrap:"wrap" as const }}>
          <div>
            <p style={{ margin:"0 0 4px", fontSize:15, fontWeight:800, color:"#f1f5f9" }}>Stay in the Loop</p>
            <p style={{ margin:0, color:"#64748b", fontSize:13 }}>New releases and exclusives — to your inbox.</p>
          </div>
          <div style={{ display:"flex" }}>
            <input placeholder="Your email" style={{ background:"#0c0e12", border:"1px solid rgba(255,255,255,0.07)", borderRight:"none", borderRadius:"9px 0 0 9px", padding:"11px 16px", color:"#f1f5f9", fontSize:13, outline:"none", width:220 }} />
            <button style={{ background:"linear-gradient(135deg,#c4290a,#f43a09)", border:"none", color:"#fff", padding:"11px 20px", borderRadius:"0 9px 9px 0", cursor:"pointer", fontSize:13, fontWeight:700 }}>Subscribe</button>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:22, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap" as const, gap:12 }}>
          <p style={{ margin:0, color:"#334155", fontSize:12 }}>© 2026 StreamVault Technologies Pvt. Ltd. · Made with ❤️ in Pakistan 🇵🇰</p>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#68d388", animation:"pulse2 2s infinite" }} />
            <span style={{ color:"#68d388", fontSize:11, fontWeight:700 }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
