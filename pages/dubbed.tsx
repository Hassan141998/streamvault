import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { tmdb } from "../lib/tmdb";
import Navbar from "../components/Navbar";
import Row from "../components/Row";
import Footer from "../components/Footer";

const DubbedPage: NextPage<{ bollywood: any[]; turkish: any[]; korean: any[]; french: any[] }> = ({ bollywood, turkish, korean, french }) => (
  <>
    <Head><title>Dubbed &amp; Subtitles — StreamVault</title></Head>
    <Navbar />
    <main style={{ minHeight: "100vh", paddingTop: 90, paddingBottom: 60 }}>
      <div style={{ padding: "0 52px 36px", maxWidth: 1400, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 34, color: "#f1f5f9", marginBottom: 8 }}>🌐 Dubbed &amp; Subtitled</h1>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32, maxWidth: 600 }}>
          Hindi/Urdu dubbed versions plus multi-language subtitles. Use <strong style={{ color: "#a78bfa" }}>Smashy player</strong> for dubbed, <strong style={{ color: "#c2edda" }}>2Embed</strong> for subtitles on the watch page.
        </p>

        {/* Player guide */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12, marginBottom: 40 }}>
          {[
            { name: "VidSrc", color: "#f43a09", langs: "English subtitles, HD", icon: "📺" },
            { name: "AutoEmbed", color: "#68d388", langs: "Arabic, French, Spanish subs", icon: "🌍" },
            { name: "2Embed", color: "#c2edda", langs: "SRT subtitles embedded", icon: "💬" },
            { name: "Smashy", color: "#a78bfa", langs: "Hindi/Urdu dubbed ✓", icon: "🎤" },
            { name: "MultiEmbed", color: "#fb7185", langs: "Multiple audio tracks", icon: "🔊" },
          ].map(p => (
            <div key={p.name} style={{ background: "#13161c", border: `1px solid ${p.color}30`, borderLeft: `3px solid ${p.color}`, borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 800, color: p.color }}>{p.icon} {p.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>{p.langs}</p>
            </div>
          ))}
        </div>
      </div>

      <Row title="🎬 Bollywood (Hindi Dubbed)"   items={bollywood} accent="#ffb766" type="movie" />
      <Row title="🌙 Turkish Drama (Dubbed)"      items={turkish}   accent="#c2edda" type="tv" />
      <Row title="🇰🇷 K-Drama (Subbed)"            items={korean}    accent="#68d388" type="tv" />
      <Row title="🥐 French Cinema (Subbed)"      items={french}    accent="#f43a09" type="movie" />
    </main>
    <Footer />
  </>
);

export const getServerSideProps: GetServerSideProps = async () => {
  const hasKey = !!process.env.TMDB_API_KEY;
  if (!hasKey) return { props: { bollywood: [], turkish: [], korean: [], french: [] } };
  const safe = (r: PromiseSettledResult<any>) => r.status === "fulfilled" ? (r.value?.results ?? []) : [];
  const [bw, tk, kr, fr] = await Promise.allSettled([tmdb.bollywood(), tmdb.turkish(), tmdb.korean(), tmdb.french()]);
  return { props: { bollywood: safe(bw), turkish: safe(tk), korean: safe(kr), french: safe(fr) } };
};
export default DubbedPage;
