import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { tmdb } from "../lib/tmdb";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";

const REGIONS = [
  { code:"ALL", label:"🌍 All" },
  { code:"US",  label:"🇺🇸 Hollywood" },
  { code:"IN",  label:"🇮🇳 Bollywood" },
  { code:"TR",  label:"🇹🇷 Turkish" },
  { code:"FR",  label:"🇫🇷 French" },
  { code:"PK",  label:"🇵🇰 Pakistani" },
  { code:"KR",  label:"🇰🇷 Korean" },
];

interface Props { shows: any[]; hasKey: boolean; }

const SeriesPage: NextPage<Props> = ({ shows, hasKey }) => {
  const [region, setRegion] = useState("ALL");

  const filtered = region === "ALL" ? shows
    : shows.filter(s => s.origin_country?.includes(region) || s.original_language === region.toLowerCase());

  return (
    <>
      <Head><title>TV Series — StreamVault</title></Head>
      <Navbar />
      <main style={{ minHeight:"100vh", padding:"90px 52px 60px" }}>
        <div style={{ maxWidth:1400, margin:"0 auto" }}>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:36, fontWeight:900, color:"#f1f5f9", marginBottom:8 }}>
            📺 TV Series
          </h1>
          <p style={{ color:"#64748b", fontSize:14, marginBottom:28 }}>Turkish dramas, Bollywood hits, Korean shows &amp; more</p>

          {/* Region filter */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:32 }}>
            {REGIONS.map(r => (
              <button key={r.code} onClick={()=>setRegion(r.code)}
                style={{ padding:"7px 18px", borderRadius:22, border:"none", cursor:"pointer", fontSize:13, fontWeight:700,
                  background:region===r.code?"linear-gradient(135deg,#c4290a,#f43a09)":"rgba(255,255,255,0.07)",
                  color:region===r.code?"#fff":"#64748b", transition:"all 0.2s",
                  boxShadow:region===r.code?"0 0 16px rgba(244,58,9,0.4)":"none" }}>
                {r.label}
              </button>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(174px,1fr))", gap:14 }}>
            {filtered.map(s => <Card key={s.id} item={s} type="tv" />)}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:"80px 0", color:"#334155" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📺</div>
              <p>{hasKey ? "No shows found for this region." : "Add your TMDB_API_KEY to ..env.local to load shows."}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const hasKey = !!process.env.TMDB_API_KEY;
  if (!hasKey) return { props: { shows:[], hasKey } };

  const safe = (r: PromiseSettledResult<any>) =>
    r.status === "fulfilled" ? (r.value?.results ?? []) : [];

  const [pop, tk, pk, kr] = await Promise.allSettled([
    tmdb.popularTV(), tmdb.turkish(), tmdb.pakistani(),
    fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&with_origin_country=KR&sort_by=popularity.desc`).then(r=>r.json()),
  ]);

  const all = [...safe(pop), ...safe(tk), ...safe(pk), ...safe(kr)];
  const unique = Array.from(new Map(all.map(s=>[s.id,s])).values());

  return { props: { shows: unique.slice(0, 100), hasKey } };
};

export default SeriesPage;
