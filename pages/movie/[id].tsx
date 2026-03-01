import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { tmdb, backdropUrl, posterUrl, profileUrl, getBestYouTubeKey } from "../../lib/tmdb";
import Navbar from "../../components/Navbar";
import Row from "../../components/Row";
import Footer from "../../components/Footer";
import toast from "react-hot-toast";

const PILL = (bg: string, color: string) => ({ background: bg, color, fontSize: 11, fontWeight: 700 as const, padding: "3px 12px", borderRadius: 20, border: `1px solid ${color}30` });

const MoviePage: NextPage<{ movie: any }> = ({ movie }) => {
  const { data: session } = useSession();
  const [trailer, setTrailer] = useState(false);
  const [inList,  setInList]  = useState(false);

  if (!movie) return <div style={{ color:"#f1f5f9", padding:80, textAlign:"center" }}>Movie not found. <Link href="/" style={{color:"#f43a09"}}>Go home</Link></div>;

  const key      = getBestYouTubeKey(movie.videos);
  const cast     = movie.credits?.cast?.slice(0,10) ?? [];
  const related  = movie.similar?.results?.slice(0,12) ?? [];
  const year     = movie.release_date?.slice(0,4) ?? "";
  const runtime  = movie.runtime ? `${Math.floor(movie.runtime/60)}h ${movie.runtime%60}m` : "";
  const rating   = movie.vote_average ? Number(movie.vote_average).toFixed(1) : "—";

  const toggleList = async () => {
    if (!session) { toast.error("Sign in to save to your list"); return; }
    await fetch("/api/watchlist", { method: inList?"DELETE":"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ tmdbId:movie.id, mediaType:"movie", title:movie.title, poster:movie.poster_path }) });
    setInList(!inList);
    toast.success(inList ? "Removed from My List" : "Added to My List ✓");
  };

  return (
    <>
      <Head><title>{movie.title} — StreamVault</title><meta name="description" content={movie.overview?.slice(0,160)} /></Head>
      <Navbar transparent />

      {/* Backdrop */}
      <div style={{ position:"relative", minHeight:"92vh" }}>
        {movie.backdrop_path && (
          <img src={backdropUrl(movie.backdrop_path,"original")} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.3, pointerEvents:"none" }} />
        )}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(12,14,18,0.97) 35%,rgba(12,14,18,0.6) 65%,transparent)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,#0c0e12 0%,transparent 50%)", pointerEvents:"none" }} />

        <div style={{ position:"relative", maxWidth:1300, margin:"0 auto", padding:"120px 52px 60px", display:"flex", gap:48, flexWrap:"wrap" as const, alignItems:"flex-start" }}>
          {/* Poster */}
          <div style={{ flexShrink:0 }}>
            <img src={posterUrl(movie.poster_path,"w342")} alt={movie.title} onError={e=>{(e.target as HTMLImageElement).src="/placeholder-poster.jpg"}} style={{ width:240, borderRadius:18, boxShadow:"0 24px 60px rgba(0,0,0,0.7)", border:"1px solid rgba(255,255,255,0.1)" }} />
          </div>

          {/* Info */}
          <div style={{ flex:1, minWidth:280 }}>
            {/* Genre pills */}
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" as const, marginBottom:16 }}>
              {movie.genres?.map((g: any) => <span key={g.id} style={PILL("rgba(244,58,9,0.12)","#f43a09")}>{g.name}</span>)}
            </div>

            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(28px,4vw,56px)", fontWeight:900, color:"#fff", lineHeight:1.08, marginBottom:10 }}>{movie.title}</h1>

            <div style={{ display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" as const, marginBottom:16, fontSize:14 }}>
              <span style={{ color:"#fbbf24", fontWeight:800, fontSize:16 }}>★ {rating}</span>
              <span style={{ color:"#64748b" }}>{movie.vote_count?.toLocaleString()} votes</span>
              {year && <span style={{ color:"#64748b" }}>{year}</span>}
              {runtime && <span style={{ color:"#64748b" }}>{runtime}</span>}
              <span style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.14)", color:"#94a3b8", padding:"2px 10px", borderRadius:6, fontSize:11, fontWeight:700 }}>HD · 4K</span>
            </div>

            <p style={{ color:"#94a3b8", lineHeight:1.75, marginBottom:28, maxWidth:560, fontSize:14.5 }}>{movie.overview}</p>

            {/* Buttons */}
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" as const, marginBottom:32 }}>
              <a href={key ? `https://www.youtube.com/watch?v=${key}` : "#"} target="_blank" rel="noreferrer"
                style={{ background:"linear-gradient(135deg,#c4290a,#f43a09)", color:"#fff", padding:"13px 32px", borderRadius:11, fontSize:14, fontWeight:800, display:"inline-block", boxShadow:"0 0 28px rgba(244,58,9,0.45)" }}>
                ▶ Watch Trailer
              </a>
              <button onClick={toggleList} style={{ padding:"13px 20px", background:inList?"rgba(104,211,136,0.15)":"rgba(255,255,255,0.07)", border:`1px solid ${inList?"rgba(104,211,136,0.4)":"rgba(255,255,255,0.12)"}`, color:inList?"#68d388":"#fff", borderRadius:11, cursor:"pointer", fontSize:13, fontWeight:700 }}>
                {inList ? "✓ In My List" : "+ My List"}
              </button>
            </div>

            {/* Meta grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10, maxWidth:560 }}>
              {[["Language", movie.original_language?.toUpperCase()], ["Released", movie.release_date ?? "—"], ["Runtime", runtime || "—"], ["Status", movie.status ?? "—"]].map(([l,v])=>(
                <div key={l} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"12px 16px" }}>
                  <p style={{ margin:"0 0 3px", color:"#334155", fontSize:10, fontWeight:800, textTransform:"uppercase" as const, letterSpacing:"1.5px" }}>{l}</p>
                  <p style={{ margin:0, color:"#f1f5f9", fontSize:13, fontWeight:600 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cast */}
      {cast.length > 0 && (
        <section style={{ maxWidth:1300, margin:"0 auto", padding:"0 52px 48px" }}>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, fontWeight:900, color:"#f1f5f9", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ width:3, height:20, background:"#f43a09", borderRadius:2, display:"inline-block", boxShadow:"0 0 10px #f43a09" }} />Cast
          </h2>
          <div className="hide-scrollbar" style={{ display:"flex", gap:16, overflowX:"auto", paddingBottom:8 }}>
            {cast.map((p: any) => (
              <div key={p.id} style={{ flexShrink:0, width:100, textAlign:"center" as const }}>
                <img src={profileUrl(p.profile_path)} alt={p.name} onError={e=>{(e.target as HTMLImageElement).src="/placeholder-person.jpg"}} style={{ width:72, height:72, borderRadius:"50%", objectFit:"cover", border:"2px solid rgba(255,255,255,0.1)", marginBottom:6 }} />
                <p style={{ fontSize:12, fontWeight:700, color:"#f1f5f9", margin:"0 0 2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const }}>{p.name}</p>
                <p style={{ fontSize:10, color:"#64748b", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const }}>{p.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && <Row title="More Like This" items={related} accent="#c2edda" type="movie" />}

      {/* Trailer modal */}
      {trailer && key && (
        <div onClick={()=>setTrailer(false)} style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.9)", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(8px)" }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"min(920px,94vw)", aspectRatio:"16/9", position:"relative" }}>
            <iframe src={`https://www.youtube.com/embed/${key}?autoplay=1`} allow="autoplay;encrypted-media" allowFullScreen style={{ width:"100%", height:"100%", border:"none", borderRadius:16 }} />
            <button onClick={()=>setTrailer(false)} style={{ position:"absolute", top:-44, right:0, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff", width:36, height:36, borderRadius:"50%", cursor:"pointer", fontSize:17 }}>✕</button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = parseInt(params?.id as string);
  if (isNaN(id)) return { notFound: true };
  try {
    const movie = await tmdb.movieDetail(id);
    if (!movie?.id) return { notFound: true };
    return { props: { movie } };
  } catch { return { notFound: true }; }
};

export default MoviePage;
