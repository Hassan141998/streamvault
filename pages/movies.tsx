import type { GetServerSideProps, NextPage } from "next"; import Head from "next/head"; import { useState } from "react"; import { tmdb } from "../lib/tmdb"; import Navbar from "../components/Navbar"; import Footer from "../components/Footer"; import Card from "../components/Card";
const G=[{id:0,name:"All"},{id:28,name:"Action"},{id:12,name:"Adventure"},{id:35,name:"Comedy"},{id:80,name:"Crime"},{id:18,name:"Drama"},{id:27,name:"Horror"},{id:10749,name:"Romance"},{id:878,name:"Sci-Fi"},{id:53,name:"Thriller"}];
const MoviesPage: NextPage<{movies:any[];hasKey:boolean}> = ({movies,hasKey}) => {
  const [genre,setGenre]=useState(0); const filtered=genre?movies.filter(m=>m.genre_ids?.includes(genre)):movies;
  return (<><Head><title>Movies — StreamVault</title></Head><Navbar/>
    <main style={{minHeight:"100vh",padding:"90px 52px 60px"}}>
      <div style={{maxWidth:1400,margin:"0 auto"}}>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:34,fontWeight:900,color:"#f1f5f9",marginBottom:6}}>🎬 Movies</h1>
        <p style={{color:"#64748b",fontSize:13,marginBottom:22}}>{movies.length}+ movies worldwide</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:26}}>
          {G.map(g=><button key={g.id} onClick={()=>setGenre(g.id===genre?0:g.id)} style={{padding:"7px 18px",borderRadius:22,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,background:genre===g.id?"#f43a09":"rgba(255,255,255,.07)",color:genre===g.id?"#fff":"#64748b",transition:"all .2s"}}>{g.name}</button>)}
        </div>
        {!hasKey&&<div style={{background:"rgba(244,58,9,.07)",border:"1px solid rgba(244,58,9,.2)",borderRadius:10,padding:"12px 16px",marginBottom:22}}><p style={{color:"#f43a09",fontSize:13}}>⚠️ Add TMDB_API_KEY to .env.local</p></div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(174px,1fr))",gap:14}}>{filtered.map(m=><Card key={m.id} item={m} type="movie"/>)}</div>
      </div>
    </main><Footer/>
  </>);
};
export const getServerSideProps: GetServerSideProps = async () => {
  const hasKey=!!process.env.TMDB_API_KEY; if(!hasKey) return {props:{movies:[],hasKey}};
  const safe=(r:PromiseSettledResult<any>)=>r.status==="fulfilled"?(r.value?.results??[]):[];
  const [p,t,n,b,f]=await Promise.allSettled([tmdb.popular(),tmdb.topMovies(),tmdb.nowPlaying(),tmdb.bollywood(),tmdb.french()]);
  const all=[...safe(p),...safe(t),...safe(n),...safe(b),...safe(f)];
  return {props:{movies:Array.from(new Map(all.map(m=>[m.id,m])).values()).slice(0,120),hasKey}};
};
export default MoviesPage;
