import type { GetServerSideProps, NextPage } from "next"; import Head from "next/head"; import { tmdb } from "../lib/tmdb"; import Navbar from "../components/Navbar"; import Row from "../components/Row"; import Footer from "../components/Footer";
const DubbedPage: NextPage<{bollywood:any[];turkish:any[];korean:any[];french:any[]}> = ({bollywood,turkish,korean,french}) => (
  <><Head><title>Dubbed &amp; Subtitles — StreamVault</title></Head><Navbar/>
    <main style={{minHeight:"100vh",paddingTop:90,paddingBottom:60}}>
      <div style={{padding:"0 52px 32px",maxWidth:1400,margin:"0 auto"}}>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:34,color:"#f1f5f9",marginBottom:8}}>🌐 Dubbed &amp; Subtitled</h1>
        <p style={{color:"#64748b",fontSize:14,marginBottom:28,maxWidth:600}}>Use <strong style={{color:"#a78bfa"}}>Smashy player</strong> for Hindi/Urdu dubbed. <strong style={{color:"#c2edda"}}>2Embed</strong> or <strong style={{color:"#68d388"}}>AutoEmbed</strong> for subtitles — switch on the watch page.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:36}}>
          {[{n:"VidSrc",c:"#f43a09",t:"English subs · HD"},{n:"AutoEmbed",c:"#68d388",t:"Arabic/French/Spanish"},{n:"2Embed",c:"#c2edda",t:"SRT embedded"},{n:"Smashy",c:"#a78bfa",t:"Hindi/Urdu DUBBED ✓"},{n:"MultiEmbed",c:"#fb7185",t:"Multiple audio tracks"}].map(p=>(
            <div key={p.n} style={{background:"#13161c",border:`1px solid ${p.c}30`,borderLeft:`3px solid ${p.c}`,borderRadius:12,padding:"12px 14px"}}>
              <p style={{margin:"0 0 3px",fontSize:13,fontWeight:800,color:p.c}}>{p.n}</p>
              <p style={{margin:0,fontSize:11,color:"#64748b"}}>{p.t}</p>
            </div>
          ))}
        </div>
      </div>
      <Row title="🎬 Bollywood (Hindi)" items={bollywood} accent="#ffb766" type="movie"/>
      <Row title="🌙 Turkish Drama"     items={turkish}   accent="#c2edda" type="tv"/>
      <Row title="🇰🇷 K-Drama"           items={korean}    accent="#68d388" type="tv"/>
      <Row title="🥐 French Cinema"     items={french}    accent="#f43a09" type="movie"/>
    </main><Footer/>
  </>
);
export const getServerSideProps: GetServerSideProps = async () => {
  if (!process.env.TMDB_API_KEY) return {props:{bollywood:[],turkish:[],korean:[],french:[]}};
  const safe=(r:PromiseSettledResult<any>)=>r.status==="fulfilled"?(r.value?.results??[]):[];
  const [b,t,k,f]=await Promise.allSettled([tmdb.bollywood(),tmdb.turkish(),tmdb.korean(),tmdb.french()]);
  return {props:{bollywood:safe(b),turkish:safe(t),korean:safe(k),french:safe(f)}};
};
export default DubbedPage;
