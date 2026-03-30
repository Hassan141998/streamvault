import type { GetServerSideProps, NextPage } from "next"; import Head from "next/head"; import Link from "next/link"; import { useState } from "react"; import { tmdb, backdropUrl, posterUrl, profileUrl, getTrailerKey } from "../../lib/tmdb"; import Navbar from "../../components/Navbar"; import Row from "../../components/Row"; import Footer from "../../components/Footer";
const PL=[{id:"vidsrc",l:"VidSrc",c:"#f43a09"},{id:"vidsrc2",l:"VidSrc 2",c:"#ffb766"},{id:"autoembed",l:"AutoEmbed",c:"#68d388"},{id:"2embed",l:"2Embed",c:"#c2edda"},{id:"smashy",l:"Smashy",c:"#a78bfa"},{id:"multi",l:"MultiEmbed",c:"#fb7185"}];
const eu=(pid:string,id:number,s:number,e:number)=>({vidsrc:`https://vidsrc.to/embed/tv/${id}/${s}/${e}`,vidsrc2:`https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,autoembed:`https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`,"2embed":`https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,smashy:`https://embed.smashystream.com/playere.php?tmdb=${id}&season=${s}&episode=${e}`,multi:`https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}`}[pid]||`https://vidsrc.to/embed/tv/${id}/${s}/${e}`);
const TVPage: NextPage<{show:any}> = ({show}) => {
  const [trailer,setTrailer]=useState(false); const [player,setPlayer]=useState("vidsrc"); const [watching,setWatching]=useState(false); const [season,setSeason]=useState(1); const [episode,setEpisode]=useState(1);
  if (!show) return <div style={{minHeight:"100vh",background:"#0c0e12",display:"flex",alignItems:"center",justifyContent:"center"}}><p style={{color:"#64748b"}}>Not found. <Link href="/" style={{color:"#f43a09"}}>Go Home</Link></p></div>;
  const key=getTrailerKey(show.videos); const cast=show.credits?.cast?.slice(0,14)??[]; const related=show.similar?.results?.slice(0,12)??[];
  const year=show.first_air_date?.slice(0,4)??""; const rating=show.vote_average?Number(show.vote_average).toFixed(1):"—";
  const seasons=Array.from({length:show.number_of_seasons??1},(_,i)=>i+1);
  const epCount=show.seasons?.find((s:any)=>s.season_number===season)?.episode_count??20;
  const episodes=Array.from({length:Math.min(epCount,50)},(_,i)=>i+1);
  return (<><Head><title>{show.name} — StreamVault</title></Head><Navbar transparent/>
    {watching&&(
      <div style={{position:"fixed",inset:0,zIndex:500,background:"#000",display:"flex",flexDirection:"column" as const}}>
        <div style={{height:50,background:"rgba(12,14,18,.98)",borderBottom:"1px solid rgba(255,255,255,.07)",display:"flex",alignItems:"center",padding:"0 16px",gap:10,flexShrink:0,flexWrap:"wrap" as const}}>
          <button onClick={()=>setWatching(false)} style={{background:"none",border:"none",color:"#f43a09",fontSize:18,cursor:"pointer"}}>✕</button>
          <span style={{color:"#f1f5f9",fontSize:14,fontWeight:700}}>{show.name} — S{season}E{episode}</span>
          <select value={season} onChange={e=>{setSeason(Number(e.target.value));setEpisode(1);}} style={{background:"#181c24",border:"1px solid rgba(255,255,255,.1)",color:"#f1f5f9",padding:"4px 8px",borderRadius:7,fontSize:12}}>
            {seasons.map(s=><option key={s} value={s}>S{s}</option>)}
          </select>
          <select value={episode} onChange={e=>setEpisode(Number(e.target.value))} style={{background:"#181c24",border:"1px solid rgba(255,255,255,.1)",color:"#f1f5f9",padding:"4px 8px",borderRadius:7,fontSize:12}}>
            {episodes.map(ep=><option key={ep} value={ep}>E{ep}</option>)}
          </select>
          <div style={{marginLeft:"auto",display:"flex",gap:6,flexWrap:"wrap" as const}}>
            {PL.map(p=><button key={p.id} onClick={()=>setPlayer(p.id)} style={{padding:"4px 11px",borderRadius:7,border:`1px solid ${player===p.id?p.c:"rgba(255,255,255,.08)"}`,background:player===p.id?`${p.c}20`:"transparent",color:player===p.id?p.c:"#64748b",fontSize:11,fontWeight:700}}>{p.l}</button>)}
          </div>
        </div>
        <iframe key={`${player}-${season}-${episode}`} src={eu(player,show.id,season,episode)} allowFullScreen allow="autoplay;fullscreen" style={{flex:1,border:"none"}}/>
      </div>
    )}
    <div style={{position:"relative",minHeight:"90vh",background:"#0c0e12"}}>
      {show.backdrop_path&&<img src={backdropUrl(show.backdrop_path,"original")} alt="" onError={e=>{(e.target as HTMLImageElement).style.display="none"}} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.28,pointerEvents:"none"}}/>}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,rgba(12,14,18,.97) 35%,rgba(12,14,18,.55) 65%,transparent)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,#0c0e12,transparent 50%)",pointerEvents:"none"}}/>
      <div style={{position:"relative",maxWidth:1300,margin:"0 auto",padding:"120px 52px 60px",display:"flex",gap:48,flexWrap:"wrap" as const,alignItems:"flex-start"}}>
        <img src={posterUrl(show.poster_path,"w342")} alt={show.name} onError={e=>{(e.target as HTMLImageElement).src="/placeholder-poster.jpg"}} style={{width:220,borderRadius:18,boxShadow:"0 24px 60px rgba(0,0,0,.7)",border:"1px solid rgba(255,255,255,.1)",flexShrink:0}}/>
        <div style={{flex:1,minWidth:260}}>
          <div style={{display:"flex",gap:7,flexWrap:"wrap" as const,marginBottom:14}}>{show.genres?.map((g:any)=><span key={g.id} style={{background:"rgba(104,211,136,.1)",color:"#68d388",fontSize:11,fontWeight:700,padding:"3px 12px",borderRadius:20,border:"1px solid rgba(104,211,136,.25)"}}>{g.name}</span>)}</div>
          <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(24px,4vw,52px)",fontWeight:900,color:"#fff",lineHeight:1.08,marginBottom:12}}>{show.name}</h1>
          <div style={{display:"flex",gap:14,flexWrap:"wrap" as const,alignItems:"center",marginBottom:14}}>
            <span style={{color:"#fbbf24",fontWeight:800}}>★ {rating}</span>
            {year&&<span style={{color:"#64748b"}}>{year}</span>}
            <span style={{color:"#64748b"}}>{show.number_of_seasons} Season{show.number_of_seasons>1?"s":""} · {show.number_of_episodes} Eps</span>
          </div>
          <p style={{color:"#94a3b8",lineHeight:1.78,marginBottom:22,maxWidth:520,fontSize:14}}>{show.overview}</p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap" as const,marginBottom:18}}>
            <button onClick={()=>setWatching(true)} style={{background:"linear-gradient(135deg,#c4290a,#f43a09)",color:"#fff",padding:"13px 30px",borderRadius:11,fontSize:14,fontWeight:800,border:"none",boxShadow:"0 0 28px rgba(244,58,9,.45)",cursor:"pointer"}}>▶ Watch S{season}E{episode}</button>
            {key&&<button onClick={()=>setTrailer(true)} style={{padding:"13px 22px",background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",color:"#fff",borderRadius:11,fontSize:13,fontWeight:700}}>🎬 Trailer</button>}
          </div>
          <div style={{marginBottom:18}}>
            <p style={{color:"#64748b",fontSize:10,fontWeight:800,textTransform:"uppercase" as const,letterSpacing:"2px",marginBottom:8}}>Server</p>
            <div style={{display:"flex",gap:7,flexWrap:"wrap" as const,marginBottom:14}}>{PL.map(p=><button key={p.id} onClick={()=>setPlayer(p.id)} style={{padding:"6px 13px",borderRadius:8,border:`1px solid ${player===p.id?p.c:"rgba(255,255,255,.1)"}`,background:player===p.id?`${p.c}20`:"rgba(255,255,255,.05)",color:player===p.id?p.c:"#64748b",fontSize:11,fontWeight:700}}>{p.l}</button>)}</div>
            <p style={{color:"#64748b",fontSize:10,fontWeight:800,textTransform:"uppercase" as const,letterSpacing:"2px",marginBottom:8}}>Season</p>
            <div style={{display:"flex",gap:7,flexWrap:"wrap" as const,marginBottom:14}}>{seasons.map(s=><button key={s} onClick={()=>{setSeason(s);setEpisode(1);}} style={{width:36,height:36,borderRadius:9,fontSize:13,fontWeight:700,border:`1px solid ${season===s?"#f43a09":"rgba(255,255,255,.1)"}`,background:season===s?"#f43a09":"rgba(255,255,255,.05)",color:season===s?"#fff":"#64748b"}}>{s}</button>)}</div>
            <p style={{color:"#64748b",fontSize:10,fontWeight:800,textTransform:"uppercase" as const,letterSpacing:"2px",marginBottom:8}}>Episode</p>
            <div style={{display:"flex",gap:7,flexWrap:"wrap" as const}}>{episodes.slice(0,24).map(ep=><button key={ep} onClick={()=>setEpisode(ep)} style={{width:36,height:36,borderRadius:9,fontSize:12,fontWeight:700,border:`1px solid ${episode===ep?"#68d388":"rgba(255,255,255,.08)"}`,background:episode===ep?"rgba(104,211,136,.2)":"rgba(255,255,255,.04)",color:episode===ep?"#68d388":"#64748b"}}>{ep}</button>)}</div>
          </div>
        </div>
      </div>
    </div>
    {cast.length>0&&<section style={{maxWidth:1300,margin:"0 auto",padding:"0 52px 48px"}}><h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color:"#f1f5f9",marginBottom:18}}>Cast</h2><div className="hide-scrollbar" style={{display:"flex",gap:14,overflowX:"auto"}}>{cast.map((p:any)=><div key={p.id} style={{flexShrink:0,width:88,textAlign:"center" as const}}><img src={profileUrl(p.profile_path)} alt={p.name} onError={e=>{(e.target as HTMLImageElement).src="/placeholder-person.jpg"}} style={{width:66,height:66,borderRadius:"50%",objectFit:"cover",border:"2px solid rgba(255,255,255,.1)",marginBottom:6}}/><p style={{fontSize:11,fontWeight:700,color:"#f1f5f9",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" as const}}>{p.name}</p><p style={{fontSize:10,color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" as const}}>{p.character}</p></div>)}</div></section>}
    {related.length>0&&<Row title="More Like This" items={related} accent="#68d388" type="tv"/>}
    {trailer&&key&&<div onClick={()=>setTrailer(false)} style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.92)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}}><div onClick={e=>e.stopPropagation()} style={{width:"min(880px,94vw)",aspectRatio:"16/9",position:"relative"}}><iframe src={`https://www.youtube.com/embed/${key}?autoplay=1&rel=0`} allow="autoplay;encrypted-media" allowFullScreen style={{width:"100%",height:"100%",border:"none",borderRadius:14}}/><button onClick={()=>setTrailer(false)} style={{position:"absolute",top:-42,right:0,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"#fff",width:34,height:34,borderRadius:"50%",fontSize:14}}>✕</button></div></div>}
    <Footer/>
  </>);
};
export const getServerSideProps: GetServerSideProps = async ({params}) => { const id=parseInt(params?.id as string); if(isNaN(id)) return {notFound:true}; try { const show=await tmdb.tvDetail(id); if(!show?.id) return {notFound:true}; return {props:{show}}; } catch { return {notFound:true}; } };
export default TVPage;
