import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { tmdb } from "../lib/tmdb";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Row from "../components/Row";
import Footer from "../components/Footer";
import SetupBanner from "../components/SetupBanner";

const DEMO = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1, title: ["Inception","The Dark Knight","Interstellar","Parasite","Money Heist","Lupin","3 Idiots","Ertuğrul","Barfi!","Pathaan","Dune","Avatar","Oppenheimer","Killers of the Flower Moon","Past Lives","Saltburn","The Bear","Succession","Wednesday","Shogun"][i],
  overview: "Add TMDB_API_KEY to .env.local to see real content.", poster_path: null, backdrop_path: null, vote_average: 8.1 + (i % 4) * 0.2, release_date: `${2020 + (i % 5)}-01-01`, media_type: i > 12 ? "tv" : "movie", genre_ids: [28, 12],
}));

interface Props { trending: any[]; topMovies: any[]; nowPlaying: any[]; bollywood: any[]; turkish: any[]; french: any[]; popularTV: any[]; korean: any[]; topTV: any[]; hasTMDB: boolean; hasDB: boolean; }

const Home: NextPage<Props> = ({ trending, topMovies, nowPlaying, bollywood, turkish, french, popularTV, korean, topTV, hasTMDB, hasDB }) => (
  <>
    <Head>
      <title>StreamVault — Watch Movies &amp; Series Free in 4K</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Stream Hollywood, Bollywood, Turkish and Korean content free in 4K with subtitles and dubbed versions." />
    </Head>
    <Navbar />
    {(!hasTMDB || !hasDB) && <SetupBanner hasTMDB={hasTMDB} hasDB={hasDB} />}
    <Hero items={trending.length ? trending.slice(0, 6) : DEMO.slice(0, 6)} />
    <main style={{ paddingBottom: 32 }}>
      <Row title="🔥 Trending Now"     items={trending.length   ? trending   : DEMO}       accent="#f43a09" type="movie" />
      <Row title="⭐ Top Rated Movies"  items={topMovies.length  ? topMovies  : DEMO}       accent="#ffb766" type="movie" />
      <Row title="🆕 Now Playing"       items={nowPlaying.length ? nowPlaying : DEMO}       accent="#68d388" type="movie" />
      <Row title="📺 Popular Series"    items={popularTV.length  ? popularTV  : []}         accent="#c2edda" type="tv" />
      <Row title="🏆 Top Rated TV"      items={topTV.length      ? topTV      : []}         accent="#a78bfa" type="tv" />
      {bollywood.length > 0 && <Row title="🎬 Bollywood"       items={bollywood} accent="#ffb766" type="movie" />}
      {turkish.length  > 0 && <Row title="🌙 Turkish Drama"    items={turkish}   accent="#c2edda" type="tv" />}
      {french.length   > 0 && <Row title="🥐 French Cinema"    items={french}    accent="#f43a09" type="movie" />}
      {korean.length   > 0 && <Row title="🇰🇷 Korean Drama"     items={korean}    accent="#68d388" type="tv" />}
    </main>
    <Footer />
  </>
);

export const getServerSideProps: GetServerSideProps = async () => {
  const hasTMDB = !!process.env.TMDB_API_KEY;
  const hasDB   = !!process.env.DATABASE_URL;
  if (!hasTMDB) return { props: { trending: [], topMovies: [], nowPlaying: [], bollywood: [], turkish: [], french: [], popularTV: [], korean: [], topTV: [], hasTMDB, hasDB } };
  const safe = (r: PromiseSettledResult<any>) => r.status === "fulfilled" ? (r.value?.results ?? []) : [];
  const [tr, top, now, bw, tk, fr, tv, kr, ttv] = await Promise.allSettled([
    tmdb.trending(), tmdb.topMovies(), tmdb.nowPlaying(), tmdb.bollywood(), tmdb.turkish(), tmdb.french(), tmdb.popularTV(), tmdb.korean(), tmdb.topTV(),
  ]);
  return { props: { trending: safe(tr), topMovies: safe(top), nowPlaying: safe(now), bollywood: safe(bw), turkish: safe(tk), french: safe(fr), popularTV: safe(tv), korean: safe(kr), topTV: safe(ttv), hasTMDB, hasDB } };
};

export default Home;
