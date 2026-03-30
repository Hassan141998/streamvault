export default function SetupBanner({ hasTMDB, hasDB }: { hasTMDB:boolean; hasDB:boolean }) {
  return (
    <div style={{marginTop:64,background:"#0f0700",borderLeft:"4px solid #f43a09",padding:"14px 52px"}}>
      {!hasTMDB&&<p style={{margin:0,color:"#f43a09",fontSize:13}}>⚠️ <strong>TMDB_API_KEY missing</strong> — Add to .env.local. Free at <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer" style={{color:"#68d388"}}>themoviedb.org</a></p>}
      {!hasDB&&<p style={{margin:hasTMDB?"0":"6px 0 0",color:"#ffb766",fontSize:13}}>⚠️ <strong>DATABASE_URL missing</strong> — Login disabled. Free at <a href="https://neon.tech" target="_blank" rel="noreferrer" style={{color:"#68d388"}}>neon.tech</a></p>}
    </div>
  );
}
