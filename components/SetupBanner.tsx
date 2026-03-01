export default function SetupBanner({ hasTMDB, hasDB }: { hasTMDB:boolean; hasDB:boolean }) {
  return (
    <div style={{ marginTop:66, background:"linear-gradient(135deg,#1a0a00,#2a1000)",
      borderLeft:"4px solid #f43a09", padding:"20px 52px", fontFamily:"monospace" }}>
      <p style={{ margin:"0 0 10px", color:"#f43a09", fontSize:14, fontWeight:800 }}>
        ⚙️ Setup — Add these to <code style={{ background:"rgba(244,58,9,0.15)", padding:"1px 6px", borderRadius:4 }}>.env.local</code> then restart:
      </p>
      <div style={{ display:"flex", flexDirection:"column" as const, gap:8 }}>
        {!hasTMDB && (
          <div style={{ background:"rgba(244,58,9,0.07)", border:"1px solid rgba(244,58,9,0.2)", borderRadius:10, padding:"12px 16px" }}>
            <p style={{ margin:"0 0 4px", color:"#ffb766", fontSize:13, fontWeight:700 }}>❌ TMDB_API_KEY missing — movies won't load</p>
            <code style={{ color:"#94a3b8", fontSize:12 }}>TMDB_API_KEY=your_key_here</code>
            <span style={{ color:"#64748b", fontSize:12 }}> → Free at <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer" style={{color:"#68d388"}}>themoviedb.org</a></span>
          </div>
        )}
        {!hasDB && (
          <div style={{ background:"rgba(104,211,136,0.05)", border:"1px solid rgba(104,211,136,0.2)", borderRadius:10, padding:"12px 16px" }}>
            <p style={{ margin:"0 0 4px", color:"#ffb766", fontSize:13, fontWeight:700 }}>❌ DATABASE_URL missing — login disabled</p>
            <code style={{ color:"#94a3b8", fontSize:12 }}>DATABASE_URL=postgresql://user:pass@host/db?sslmode=require</code>
            <span style={{ color:"#64748b", fontSize:12 }}> → Free at <a href="https://neon.tech" target="_blank" rel="noreferrer" style={{color:"#68d388"}}>neon.tech</a></span>
          </div>
        )}
      </div>
    </div>
  );
}
