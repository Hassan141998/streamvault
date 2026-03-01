import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { tmdb, backdropUrl, posterUrl, profileUrl, getTrailerKey } from "../../lib/tmdb";
import Navbar from "../../components/Navbar";
import Row from "../../components/Row";
import Footer from "../../components/Footer";
import toast from "react-hot-toast";

const MoviePage: NextPage<{ movie: any }> = ({ movie }) => {
  const { data: session } = useSession();
  const [inList,   setInList]   = useState(false);
  const [trailer,  setTrailer]  = useState(false);

  if (!movie) return (
    <div style={{ minHeight:"100vh", background:"#0c0e12", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" as const, gap:16 }}>
      <p style={{ color:"#64748b", fontSize:18 }}>Movie not found.</p>
      <Link href="/" style={{ color:"#f43a09" }}>← Go Home</Link>
    </div>
  );

  const key      = getTrailerKey(movie.videos);
  const cast     = movie.credits?.cast?.slice(0, 12) ?? [];
  const related  = movie.similar?.results?.slice(0, 12) ?? [];
  const year     = movie.release_date?.slice(0, 4) ?? "";
  const runtime  = movie.runtime ? `${Math.floor(movie.runtime/60)}h ${movie.runtime%60}m` : "";
  const rating   = movie.vote_average ? Number(movie.vote_average).toFixed(1) : "—";

  const toggleList = async () => {
    if (!session) { toast.error("Sign in to save to your list"); return; }
    const method = inList ? "DELETE" : "POST";
    await fetch("/api/watchlist", { method, headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ tmdbId:movie.id, mediaType:"movie", title:movie.title, poster:movie.poster_path }) });
    setInList(!inList);
    toast.success(inList ? "Removed from My List" : "Added to My List ✓");
  };

  return (
    <>
      <Head>
        <title>{movie.title} — StreamVault</title>
        <meta name="description" content={movie.overview?.slice(0,160)} />
      </Head>
      <Navbar transparent />

      {/* Hero backdrop */}
      <div style={{ position:"relative", minHeight:"90vh", background:"#0c0e12" }}>
        {movie.backdrop_path && (
          <img src={backdropUrl(movie.backdrop_path,"original")} alt=""
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.28, pointerEvents:"none" }}
            onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />
        )}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(12,14,18,0.97) 35%,rgba(12,14,18,0.55) 65%,transparent)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,#0c0e12,transparent 50%)", pointerEvents:"none" }} />

        <div style={{ position:"relative", maxWidth:1300, margin:"0 auto", padding:"120px 52px 60px", display:"flex", gap:48, flexWrap:"wrap" as const, alignItems:"flex-start" }}>
          {/* Poster */}
          <img src={posterUrl(movie.poster_path,"w342")} alt={movie.title}
            onError={e=>{(e.target as HTMLImageElement).src="/placeholder-poster.jpg"}}
            style={{ width:220, borderRadius:18, boxShadow:"0 24px 60px rgba(0,0,0,0.7)", border:"1px solid rgba(255,255,255,0.1)", flexShrink:0 }} />

          {/* Info */}
          <div style={{ flex:1, minWidth:280 }}>
            {/* Genre pills */}
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" as const, marginBottom:14 }}>
              {movie.genres?.map((g: any) => (
                <span key={g.id} style={{ background:"rgba(244,58,9,0.12)", color:"#f43a09", fontSize:11, fontWeight:700, padding:"3px 12px", borderRadius:20, border:"1px solid rgba(244,58,9,0.25)" }}>{g.name}</span>
              ))}
            </div>

            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(26px,4vw,54px)", fontWeight:900, color:"#fff", lineHeight:1.08, marginBottom:12 }}>
              {movie.title}
            </h1>

            <div style={{ display:"flex", gap:16, flexWrap:"wrap" as const, alignItems:"center", marginBottom:14, fontSize:14 }}>
              <span style={{ color:"#fbbf24", fontWeight:800, fontSize:15 }}>★ {rating}</span>
              {year     && <span style={{ color:"#64748b" }}>{year}</span>}
              {runtime  && <span style={{ color:"#64748b" }}>{runtime}</span>}
              <span style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.14)", color:"#94a3b8", padding:"2px 10px", borderRadius:6, fontSize:11, fontWeight:700 }}>4K HDR</span>
            </div>

            <p style={{ color:"#94a3b8", lineHeight:1.78, marginBottom:28, maxWidth:540, fontSize:14 }}>
              {movie.overview}
            </p>

            {/* Action buttons */}
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" as const, marginBottom:30 }}>
              {key ? (
                <button onClick={()=>setTrailer(true)}
                  style={{ background:"linear-gradient(135deg,#c4290a,#f43a09)", color:"#fff", padding:"13px 32px", borderRadius:11, fontSize:14, fontWeight:800, border:"none", boxShadow:"0 0 28px rgba(244,58,9,0.45)" }}>
                  ▶ Watch Trailer
                </button>
              ) : (
                <a href={`https://vidsrc.to/embed/movie/${movie.id}`} target="_blank" rel="noreferrer"
                  style={{ display:"inline-block", background:"linear-gradient(135deg,#c4290a,#f43a09)", color:"#fff", padding:"13px 32px", borderRadius:11, fontSize:14, fontWeight:800, boxShadow:"0 0 28px rgba(244,58,9,0.45)" }}>
                  ▶ Watch Now
                </a>
              )}
              <button onClick={toggleList}
                style={{ padding:"13px 20px", background:inList?"rgba(104,211,136,0.15)":"rgba(255,255,255,0.07)", border:`1px solid ${inList?"rgba(104,211,136,0.4)":"rgba(255,255,255,0.12)"}`, color:inList?"#68d388":"#fff", borderRadius:11, fontSize:13, fontWeight:700 }}>
                {inList ? "✓ In My List" : "+ My List"}
              </button>
              {key && (
                <a href={`https://vidsrc.to/embed/movie/${movie.id}`} target="_blank" rel="noreferrer"
                  style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"13px 20px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", color:"#fff", borderRadius:11, fontSize:13, fontWeight:700 }}>
                  🎬 Stream
                </a>
              )}
            </div>

            {/* Meta grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10, maxWidth:540 }}>
              {[
                ["Language", movie.original_language?.toUpperCase()],
                ["Released", movie.release_date?.slice(0,10) ?? "—"],
                ["Runtime",  runtime || "—"],
                ["Status",   movie.status ?? "—"],
              ].map(([l,v]) => (
                <div key={l} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"12px 14px" }}>
                  <p style={{ color:"#334155", fontSize:10, fontWeight:800, textTransform:"uppercase" as const, letterSpacing:"1.5px", marginBottom:4 }}>{l}</p>
                  <p style={{ color:"#f1f5f9", fontSize:13, fontWeight:600 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cast */}
      {cast.length > 0 && (
        <section style={{ maxWidth:1300, margin:"0 auto", padding:"0 52px 48px" }}>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:"#f1f5f9", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ width:3, height:18, background:"#f43a09", borderRadius:2, display:"inline-block" }} />
            Cast
          </h2>
          <div className="hide-scrollbar" style={{ display:"flex", gap:14, overflowX:"auto", paddingBottom:8 }}>
            {cast.map((p: any) => (
              <div key={p.id} style={{ flexShrink:0, width:90, textAlign:"center" as const }}>
                <img src={profileUrl(p.profile_path)} alt={p.name}
                  onError={e=>{(e.target as HTMLImageElement).src="/placeholder-person.jpg"}}
                  style={{ width:68, height:68, borderRadius:"50%", objectFit:"cover", border:"2px solid rgba(255,255,255,0.1)", marginBottom:6 }} />
                <p style={{ fontSize:11, fontWeight:700, color:"#f1f5f9", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const, marginBottom:2 }}>{p.name}</p>
                <p style={{ fontSize:10, color:"#64748b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const }}>{p.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && <Row title="More Like This" items={related} accent="#c2edda" type="movie" />}

      {/* Trailer modal */}
      {trailer && key && (
        <div onClick={()=>setTrailer(false)} style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(8px)" }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"min(900px,94vw)", aspectRatio:"16/9", position:"relative" }}>
            <iframe src={`https://www.youtube.com/embed/${key}?autoplay=1&rel=0`}
              allow="autoplay;encrypted-media" allowFullScreen
              style={{ width:"100%", height:"100%", border:"none", borderRadius:16 }} />
            <button onClick={()=>setTrailer(false)} style={{ position:"absolute", top:-44, right:0, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff", width:36, height:36, borderRadius:"50%", fontSize:16 }}>✕</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = parseInt(params?.id as string);
  if (isNaN(id)) return { notFound:true };
  try {
    const movie = await tmdb.movieDetail(id);
    if (!movie?.id) return { notFound:true };
    return { props:{ movie } };
  } catch { return { notFound:true }; }
};

export default MoviePage;
