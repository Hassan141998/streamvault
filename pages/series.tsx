import type { GetServerSideProps, NextPage } from "next"; import Head from "next/head"; import { useState } from "react"; import { tmdb } from "../lib/tmdb"; import Navbar from "../components/Navbar"; import Footer from "../components/Footer"; import Card from "../components/Card";
const R=[{c:"ALL",l:"🌍 All"},{c:"US",l:"🇺🇸 Hollywood"},{c:"IN",l:"🇮🇳 Indian"},{c:"TR",l:"🇹🇷 Turkish"},{c:"KR",l:"🇰🇷 Korean"},{c:"PK",l:"🇵🇰 Pakistani"},{c:"FR",l:"🇫🇷 French"}];
const SeriesPage: NextPage<{shows:any[];hasKey:boolean}> = ({shows,hasKey}) => {
  const [region,setRegion]=useState("ALL"); const filtered=region==="ALL"?shows:shows.filter(s=>s.origin_country?.includes(region));
  return (<><Head><title>TV Series — StreamVault</title></Head><Navbar/>
    <main style={{minHeight:"100vh",padding:"90px 52px 60px"}}>
      <div style={{maxWidth:1400,margin:"0 auto"}}>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:34,fontWeight:900,color:"#f1f5f9",marginBottom:6}}>📺 TV Series</h1>
        <p style={{color:"#64748b",fontSize:13,marginBottom:22}}>Turkish dramas, K-dramas, Bollywood &amp; more</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:26}}>
          {R.map(r=><button key={r.c} onClick={()=>setRegion(r.c)} style={{padding:"7px 18px",borderRadius:22,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,background:region===r.c?"linear-gradient(135deg,#c4290a,#f43a09)":"rgba(255,255,255,.07)",color:region===r.c?"#fff":"#64748b",transition:"all .2s",boxShadow:region===r.c?"0 0 14px rgba(244,58,9,.4)":"none"}}>{r.l}</button>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(174px,1fr))",gap:14}}>{filtered.map(s=><Card key={s.id} item={s} type="tv"/>)}</div>
        {filtered.length===0&&<div style={{textAlign:"center",padding:"60px 0",color:"#334155"}}><div style={{fontSize:48,marginBottom:12}}>📺</div><p>{hasKey?"No shows for this region.":"Add TMDB_API_KEY to load shows."}</p></div>}
      </div>
    </main><Footer/>
  </>);
};
export const getServerSideProps: GetServerSideProps = async () => {
  const hasKey=!!process.env.TMDB_API_KEY; if(!hasKey) return {props:{shows:[],hasKey}};
  const safe=(r:PromiseSettledResult<any>)=>r.status==="fulfilled"?(r.value?.results??[]):[];
  const [p,tk,kr,pk,top]=await Promise.allSettled([tmdb.popularTV(),tmdb.turkish(),tmdb.korean(),tmdb.pakistani(),tmdb.topTV()]);
  const all=[...safe(p),...safe(tk),...safe(kr),...safe(pk),...safe(top)];
  return {props:{shows:Array.from(new Map(all.map(s=>[s.id,s])).values()).slice(0,120),hasKey}};
};
export default SeriesPage;
