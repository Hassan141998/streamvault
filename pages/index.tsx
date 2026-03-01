import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { tmdb } from "../lib/tmdb";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Row from "../components/Row";
import Footer from "../components/Footer";
import SetupBanner from "../components/SetupBanner";
import DownloadBanner from "../components/DownloadBanner";

const DEMO = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: ["Inception","The Dark Knight","Interstellar","Parasite","Money Heist",
          "Lupin","3 Idiots","Ertuğrul","Barfi!","Pathaan","Dune","Avatar"][i],
  overview: "Add your TMDB_API_KEY to ..env.local to see real movie data.",
  poster_path: null, backdrop_path: null, vote_average: 8.1 + (i % 4) * 0.2,
  release_date: `${2020 + (i % 5)}-01-01`, media_type: "movie", genre_ids: [28, 12],
}));

interface Props {
  trending: any[]; topMovies: any[]; nowPlaying: any[];
  bollywood: any[]; turkish: any[]; french: any[]; popularTV: any[];
  hasTMDB: boolean; hasDB: boolean;
}

const Home: NextPage<Props> = ({ trending, topMovies, nowPlaying, bollywood, turkish, french, popularTV, hasTMDB, hasDB }) => (
  <>
    <Head>
      <title>StreamVault — Watch Movies &amp; Series in 4K Free</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <Navbar />
    {(!hasTMDB || !hasDB) && <SetupBanner hasTMDB={hasTMDB} hasDB={hasDB} />}
    <Hero items={trending.length ? trending.slice(0, 6) : DEMO.slice(0, 6)} />
    <main style={{ paddingBottom: 48 }}>
      <Row title="🔥 Trending Now"    items={trending.length  ? trending  : DEMO} accent="#f43a09" type="movie" />
      <Row title="⭐ Top Rated"        items={topMovies.length ? topMovies : DEMO} accent="#ffb766" type="movie" />
      <Row title="🆕 Now Playing"      items={nowPlaying.length? nowPlaying: DEMO} accent="#68d388" type="movie" />
      {bollywood.length > 0 && <Row title="🎬 Bollywood"    items={bollywood} accent="#ffb766" type="movie" />}
      {turkish.length  > 0 && <Row title="🌙 Turkish Drama" items={turkish}   accent="#c2edda" type="tv" />}
      {french.length   > 0 && <Row title="🥐 French Cinema" items={french}    accent="#f43a09" type="movie" />}
      {popularTV.length> 0 && <Row title="📺 Popular Series"items={popularTV} accent="#68d388" type="tv" />}
      <DownloadBanner />
    </main>
    <Footer />
  </>
);

export const getServerSideProps: GetServerSideProps = async () => {
  const hasTMDB = !!process.env.TMDB_API_KEY;
  const hasDB   = !!process.env.DATABASE_URL;
  if (!hasTMDB) return { props: { trending:[],topMovies:[],nowPlaying:[],bollywood:[],turkish:[],french:[],popularTV:[],hasTMDB,hasDB } };

  const safe = (r: PromiseSettledResult<any>) => r.status === "fulfilled" ? (r.value?.results ?? []) : [];
  const [tr,top,now,bw,tk,fr,tv] = await Promise.allSettled([
    tmdb.trending(), tmdb.topMovies(), tmdb.nowPlaying(),
    tmdb.bollywood(), tmdb.turkish(), tmdb.french(), tmdb.popularTV(),
  ]);
  return { props: { trending:safe(tr), topMovies:safe(top), nowPlaying:safe(now),
    bollywood:safe(bw), turkish:safe(tk), french:safe(fr), popularTV:safe(tv), hasTMDB, hasDB } };
};

export default Home;
