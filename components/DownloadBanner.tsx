import Link from "next/link";
export default function DownloadBanner() {
  return (
    <div style={{ margin:"0 52px 52px", borderRadius:20, background:"linear-gradient(135deg,#13161c,#181c24)",
      border:"1px solid rgba(255,255,255,0.07)", padding:"36px 44px",
      display:"flex", alignItems:"center", justifyContent:"space-between", gap:24, flexWrap:"wrap" as const,
      position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:"linear-gradient(to bottom,#f43a09,#ffb766,#68d388,#c2edda)" }} />
      <div>
        <p style={{ margin:"0 0 8px", color:"#68d388", fontSize:11, fontWeight:800, letterSpacing:"2px", textTransform:"uppercase" as const }}>Free Download</p>
        <h3 style={{ margin:"0 0 8px", fontSize:22, fontWeight:900, fontFamily:"'DM Serif Display',serif", color:"#f1f5f9" }}>
          Available on Android, Windows &amp; Mac
        </h3>
        <p style={{ margin:0, color:"#64748b", fontSize:14, maxWidth:400, lineHeight:1.65 }}>
          Stream in 4K, download offline, 5 profiles, no ads — completely free.
        </p>
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" as const }}>
        <Link href="/downloads" style={{ background:"linear-gradient(135deg,#2e8b4a,#68d388)", color:"#0c0e12", padding:"12px 22px", borderRadius:10, fontSize:13, fontWeight:800, boxShadow:"0 0 20px rgba(104,211,136,0.38)", display:"inline-block" }}>🤖 Android</Link>
        <Link href="/downloads" style={{ background:"linear-gradient(135deg,#c4290a,#f43a09)", color:"#fff", padding:"12px 22px", borderRadius:10, fontSize:13, fontWeight:800, boxShadow:"0 0 20px rgba(244,58,9,0.38)", display:"inline-block" }}>💻 Windows / Mac</Link>
      </div>
    </div>
  );
}
