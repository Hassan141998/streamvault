import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { tmdb, backdropUrl, posterUrl, profileUrl, getTrailerKey } from "../../lib/tmdb";
import Navbar from "../../components/Navbar";
import Row from "../../components/Row";
import Footer from "../../components/Footer";

const TVPage: NextPage<{ show: any }> = ({ show }) => {
  const [trailer, setTrailer] = useState(false);
  const [season,  setSeason]  = useState(1);

  if (!show) return (
    <div style={{ minHeight:"100vh", background:"#0c0e12", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <p style={{ color:"#64748b" }}>Show not found. <Link href="/" style={{color:"#f43a09"}}>Go Home</Link></p>
    </div>
  );

  const key     = getTrailerKey(show.videos);
  const cast    = show.credits?.cast?.slice(0, 12) ?? [];
  const related = show.similar?.results?.slice(0, 12) ?? [];
  const year    = show.first_air_date?.slice(0, 4) ?? "";
  const rating  = show.vote_average ? Number(show.vote_average).toFixed(1) : "—";
  const seasons = Array.from({ length: show.number_of_seasons ?? 1 }, (_, i) => i + 1);

  return (
    <>
      <Head>
        <title>{show.name} — StreamVault</title>
        <meta name="description" content={show.overview?.slice(0,160)} />
      </Head>
      <Navbar transparent />

      <div style={{ position:"relative", minHeight:"90vh", background:"#0c0e12" }}>
        {show.backdrop_path && (
          <img src={backdropUrl(show.backdrop_path,"original")} alt=""
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.28, pointerEvents:"none" }}
            onError={e=>{(e.target as HTMLImageElement).style.display="none"}} />
        )}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(12,14,18,0.97) 35%,rgba(12,14,18,0.55) 65%,transparent)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,#0c0e12,transparent 50%)", pointerEvents:"none" }} />

        <div style={{ position:"relative", maxWidth:1300, margin:"0 auto", padding:"120px 52px 60px", display:"flex", gap:48, flexWrap:"wrap" as const, alignItems:"flex-start" }}>
          <img src={posterUrl(show.poster_path,"w342")} alt={show.name}
            onError={e=>{(e.target as HTMLImageElement).src="/placeholder-poster.jpg"}}
            style={{ width:220, borderRadius:18, boxShadow:"0 24px 60px rgba(0,0,0,0.7)", border:"1px solid rgba(255,255,255,0.1)", flexShrink:0 }} />

          <div style={{ flex:1, minWidth:280 }}>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" as const, marginBottom:14 }}>
              {show.genres?.map((g: any) => (
                <span key={g.id} style={{ background:"rgba(104,211,136,0.1)", color:"#68d388", fontSize:11, fontWeight:700, padding:"3px 12px", borderRadius:20, border:"1px solid rgba(104,211,136,0.25)" }}>{g.name}</span>
              ))}
              <span style={{ background:"rgba(194,237,218,0.1)", color:"#c2edda", fontSize:11, fontWeight:700, padding:"3px 12px", borderRadius:20, border:"1px solid rgba(194,237,218,0.25)" }}>TV Series</span>
            </div>

            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(26px,4vw,54px)", fontWeight:900, color:"#fff", lineHeight:1.08, marginBottom:12 }}>{show.name}</h1>

            <div style={{ display:"flex", gap:16, flexWrap:"wrap" as const, alignItems:"center", marginBottom:14, fontSize:14 }}>
              <span style={{ color:"#fbbf24", fontWeight:800, fontSize:15 }}>★ {rating}</span>
              {year && <span style={{ color:"#64748b" }}>{year}</span>}
              <span style={{ color:"#64748b" }}>{show.number_of_seasons} Season{show.number_of_seasons>1?"s":""} · {show.number_of_episodes} Episodes</span>
            </div>

            <p style={{ color:"#94a3b8", lineHeight:1.78, marginBottom:28, maxWidth:540, fontSize:14 }}>{show.overview}</p>

            <div style={{ display:"flex", gap:10, flexWrap:"wrap" as const, marginBottom:28 }}>
              {key && (
                <button onClick={()=>setTrailer(true)}
                  style={{ background:"linear-gradient(135deg,#c4290a,#f43a09)", color:"#fff", padding:"13px 32px", borderRadius:11, fontSize:14, fontWeight:800, border:"none", boxShadow:"0 0 28px rgba(244,58,9,0.45)" }}>
                  ▶ Watch Trailer
                </button>
              )}
              <a href={`https://vidsrc.to/embed/tv/${show.id}/${season}/1`} target="_blank" rel="noreferrer"
                style={{ display:"inline-block", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", color:"#fff", padding:"13px 24px", borderRadius:11, fontSize:13, fontWeight:700 }}>
                🎬 Stream S{season}E1
              </a>
              <button style={{ padding:"13px 20px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", color:"#fff", borderRadius:11, fontSize:13, fontWeight:700 }}>
                + My List
              </button>
            </div>

            {/* Season selector */}
            <div>
              <p style={{ color:"#64748b", fontSize:10, fontWeight:800, textTransform:"uppercase" as const, letterSpacing:"2px", marginBottom:10 }}>Select Season</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" as const }}>
                {seasons.map(s => (
                  <button key={s} onClick={()=>setSeason(s)}
                    style={{ width:40, height:40, borderRadius:10, fontSize:14, fontWeight:700, border:`1px solid ${season===s?"#f43a09":"rgba(255,255,255,0.1)"}`, background:season===s?"#f43a09":"rgba(255,255,255,0.05)", color:season===s?"#fff":"#64748b", transition:"all 0.2s" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {cast.length > 0 && (
        <section style={{ maxWidth:1300, margin:"0 auto", padding:"0 52px 48px" }}>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:"#f1f5f9", marginBottom:20 }}>Cast</h2>
          <div className="hide-scrollbar" style={{ display:"flex", gap:14, overflowX:"auto", paddingBottom:8 }}>
            {cast.map((p: any) => (
              <div key={p.id} style={{ flexShrink:0, width:90, textAlign:"center" as const }}>
                <img src={profileUrl(p.profile_path)} alt={p.name}
                  onError={e=>{(e.target as HTMLImageElement).src="/placeholder-person.jpg"}}
                  style={{ width:68, height:68, borderRadius:"50%", objectFit:"cover", border:"2px solid rgba(255,255,255,0.1)", marginBottom:6 }} />
                <p style={{ fontSize:11, fontWeight:700, color:"#f1f5f9", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const }}>{p.name}</p>
                <p style={{ fontSize:10, color:"#64748b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const }}>{p.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && <Row title="More Like This" items={related} accent="#68d388" type="tv" />}

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
    const show = await tmdb.tvDetail(id);
    if (!show?.id) return { notFound:true };
    return { props:{ show } };
  } catch { return { notFound:true }; }
};

export default TVPage;
