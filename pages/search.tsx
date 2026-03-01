import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Footer from "../components/Footer";

const SearchPage: NextPage = () => {
  const { query: q } = useRouter();
  const term = (q.q as string) ?? "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (term.length < 2) { setResults([]); return; }
    setLoading(true);
    fetch(`/api/tmdb/search/multi?query=${encodeURIComponent(term)}`)
      .then(r => r.json())
      .then(d => setResults((d.results ?? []).filter((r: any) => r.media_type !== "person")))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [term]);

  return (
    <>
      <Head><title>Search: {term} — StreamVault</title></Head>
      <Navbar />
      <main style={{ minHeight:"100vh", padding:"90px 52px 60px" }}>
        <div style={{ maxWidth:1400, margin:"0 auto" }}>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:32, color:"#f1f5f9", marginBottom:8 }}>
            {term ? <>Results for "<span style={{color:"#f43a09"}}>{term}</span>"</> : "Search"}
          </h1>
          <p style={{ color:"#64748b", fontSize:14, marginBottom:32 }}>
            {results.length > 0 ? `${results.length} results` : ""}
          </p>

          {loading && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(174px,1fr))", gap:14 }}>
              {Array.from({length:12}).map((_,i) => (
                <div key={i} style={{ aspectRatio:"2/3", borderRadius:14, background:"linear-gradient(90deg,#13161c 25%,#181c24 50%,#13161c 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.5s infinite" }} />
              ))}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(174px,1fr))", gap:14 }}>
              {results.map(item => <Card key={item.id} item={item} type={item.media_type ?? "movie"} />)}
            </div>
          )}

          {!loading && term && results.length === 0 && (
            <div style={{ textAlign:"center", padding:"80px 0" }}>
              <div style={{ fontSize:64, marginBottom:16 }}>🔍</div>
              <p style={{ color:"#64748b", fontSize:18 }}>No results for "{term}"</p>
              <p style={{ color:"#334155", fontSize:14, marginTop:8 }}>Try a different keyword</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};
export default SearchPage;
