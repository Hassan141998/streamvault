import Link from "next/link";
export default function Footer() {
  const cols: [string,[string,string][]][] = [["Browse",[["Movies","/movies"],["TV Series","/series"],["Dubbed","/dubbed"],["Bollywood","/?r=IN"],["Turkish","/?r=TR"]]],["Support",[["Help","#"],["Privacy","#"],["Terms","#"],["DMCA","#"]]]];
  return (
    <footer style={{background:"#13161c",borderTop:"1px solid rgba(255,255,255,.07)",marginTop:32}}>
      <div style={{height:3,background:"linear-gradient(90deg,#f43a09,#ffb766,#68d388,#c2edda,#f43a09)"}}/>
      <div style={{padding:"36px 52px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:32,marginBottom:28}}>
          <div>
            <Link href="/" style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#c4290a,#f43a09)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:900}}>▶</div>
              <span style={{fontSize:17,fontWeight:900,color:"#f1f5f9",fontFamily:"'DM Serif Display',serif"}}>Stream<span style={{color:"#f43a09"}}>Vault</span></span>
            </Link>
            <p style={{color:"#334155",fontSize:13,lineHeight:1.7,maxWidth:230,marginBottom:16}}>Free 4K streaming — Hollywood, Bollywood, Turkish, Korean.</p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap" as const}}>
              {[["🤖","#68d388","Android"],["🪟","#f43a09","Windows"],["🍎","#ffb766","macOS"]].map(([icon,color,label])=>(
                <Link key={String(label)} href="/downloads" style={{background:`${color}12`,border:`1px solid ${color}28`,color:String(color),fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:7,display:"inline-flex",alignItems:"center",gap:4}}>{icon} {label}</Link>
              ))}
            </div>
          </div>
          {cols.map(([h,links])=>(
            <div key={h}><p style={{margin:"0 0 12px",color:"#f1f5f9",fontSize:11,fontWeight:800,textTransform:"uppercase" as const,letterSpacing:"1.5px"}}>{h}</p>
              {links.map(([l,href])=><p key={l} style={{margin:"0 0 8px"}}><Link href={href} style={{color:"#64748b",fontSize:13}} onMouseEnter={e=>(e.currentTarget.style.color="#f43a09")} onMouseLeave={e=>(e.currentTarget.style.color="#64748b")}>{l}</Link></p>)}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:18,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap" as const,gap:10}}>
          <p style={{margin:0,color:"#334155",fontSize:12}}>© 2026 StreamVault — Made with ❤️ in Pakistan 🇵🇰</p>
          <div style={{display:"flex",gap:6,alignItems:"center"}}><div style={{width:7,height:7,borderRadius:"50%",background:"#68d388",animation:"pulse2 2s infinite"}}/><span style={{color:"#68d388",fontSize:11,fontWeight:700}}>All systems operational</span></div>
        </div>
      </div>
    </footer>
  );
}
