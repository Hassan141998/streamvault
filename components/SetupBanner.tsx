export default function SetupBanner({ hasTMDB, hasDB }: { hasTMDB: boolean; hasDB: boolean }) {
  return (
    <div style={{ marginTop:66, background:"linear-gradient(135deg,#1a0a00,#2a1000)", borderLeft:"4px solid #f43a09", padding:"20px 52px", fontFamily:"monospace" }}>
      <p style={{ margin:"0 0 12px", color:"#f43a09", fontSize:14, fontWeight:800 }}>
        ⚙️ Setup Required — Add these to your <code style={{ background:"rgba(244,58,9,0.15)", padding:"1px 6px", borderRadius:4 }}>.env.local</code> file in your project root:
      </p>
      <div style={{ display:"flex", flexDirection:"column" as const, gap:10 }}>
        {!hasTMDB && (
          <div style={{ background:"rgba(244,58,9,0.07)", border:"1px solid rgba(244,58,9,0.2)", borderRadius:10, padding:"14px 18px" }}>
            <p style={{ margin:"0 0 6px", color:"#ffb766", fontSize:13, fontWeight:700 }}>❌ TMDB_API_KEY missing — movies & images won't load</p>
            <code style={{ color:"#94a3b8", fontSize:12, display:"block", marginBottom:6 }}>TMDB_API_KEY=paste_your_key_here</code>
            <p style={{ margin:0, color:"#64748b", fontSize:12 }}>Get free key (2 min): <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer" style={{ color:"#68d388" }}>themoviedb.org/settings/api</a> → Sign up → Settings → API → Create</p>
          </div>
        )}
        {!hasDB && (
          <div style={{ background:"rgba(104,211,136,0.05)", border:"1px solid rgba(104,211,136,0.2)", borderRadius:10, padding:"14px 18px" }}>
            <p style={{ margin:"0 0 6px", color:"#ffb766", fontSize:13, fontWeight:700 }}>❌ DATABASE_URL missing — login & watchlist disabled</p>
            <code style={{ color:"#94a3b8", fontSize:12, display:"block", marginBottom:6 }}>DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/streamvault?sslmode=require</code>
            <p style={{ margin:0, color:"#64748b", fontSize:12 }}>Get free DB: <a href="https://neon.tech" target="_blank" rel="noreferrer" style={{ color:"#68d388" }}>neon.tech</a> → Sign up → New Project → Connection Details → Copy string</p>
          </div>
        )}
      </div>
      <p style={{ margin:"14px 0 0", color:"#334155", fontSize:12 }}>After editing .env.local → save → stop server (Ctrl+C) → restart: <code style={{ color:"#ffb766" }}>npm run dev</code></p>
    </div>
  );
}
