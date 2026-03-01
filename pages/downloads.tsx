import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FEATURES = [
  "Stream in 4K HDR",
  "Download for offline viewing",
  "5 profiles per account",
  "50+ subtitle languages",
  "Parental controls",
  "No ads, ever",
];

const DownloadPage: NextPage = () => (
  <>
    <Head><title>Download StreamVault App</title></Head>
    <Navbar />
    <main style={{ minHeight:"100vh", background:"#0c0e12" }}>

      {/* Hero */}
      <div style={{ padding:"120px 52px 80px", textAlign:"center", background:"radial-gradient(ellipse at 50% 0%, rgba(244,58,9,0.1), transparent 65%)" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:24, background:"rgba(104,211,136,0.1)", border:"1px solid rgba(104,211,136,0.25)", padding:"6px 18px", borderRadius:20 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:"#68d388", animation:"pulse2 2s infinite" }} />
          <span style={{ color:"#68d388", fontSize:12, fontWeight:700 }}>Available Now — 100% Free</span>
        </div>
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(36px,6vw,72px)", fontWeight:900, color:"#f1f5f9", marginBottom:16, lineHeight:1.06 }}>
          Stream Anywhere.<br /><span style={{ color:"#f43a09" }}>Download Free.</span>
        </h1>
        <p style={{ color:"#64748b", fontSize:16, maxWidth:520, margin:"0 auto 48px", lineHeight:1.75 }}>
          Get the StreamVault app on your Android phone, Windows PC, or Mac. All content in 4K HDR, completely free.
        </p>

        <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
          {[
            { icon:"🤖", label:"Android APK", sub:"v2.4.1 · 28 MB", color:"#68d388", dark:"#2e8b4a", note:"Android 6.0+" },
            { icon:"🪟", label:"Windows", sub:"v2.4.1 · 64 MB", color:"#f43a09", dark:"#c4290a", note:"Windows 10/11" },
            { icon:"🍎", label:"macOS", sub:"v2.4.1 · 71 MB", color:"#ffb766", dark:"#d4834a", note:"macOS 12+" },
          ].map(d => (
            <div key={d.label} style={{ background:"linear-gradient(135deg,#13161c,#181c24)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"28px 32px", textAlign:"center", minWidth:200, cursor:"pointer", transition:"all 0.3s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform="translateY(-6px)"; (e.currentTarget as HTMLDivElement).style.borderColor=d.color+"40"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform="none"; (e.currentTarget as HTMLDivElement).style.borderColor="rgba(255,255,255,0.07)"; }}>
              <div style={{ fontSize:42, marginBottom:12 }}>{d.icon}</div>
              <p style={{ margin:"0 0 4px", fontSize:16, fontWeight:800, color:"#f1f5f9" }}>{d.label}</p>
              <p style={{ margin:"0 0 16px", fontSize:12, color:"#64748b" }}>{d.sub} · {d.note}</p>
              <button style={{ width:"100%", background:`linear-gradient(135deg,${d.dark},${d.color})`, border:"none", color:d.color==="#ffb766"?"#0c0e12":"#fff", padding:"11px 0", borderRadius:10, fontSize:13, fontWeight:800, cursor:"pointer", boxShadow:`0 0 20px ${d.color}44` }}>
                ⬇ Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding:"0 52px 80px", maxWidth:900, margin:"0 auto" }}>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, fontWeight:900, color:"#f1f5f9", textAlign:"center", marginBottom:36 }}>
          Everything Included Free
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
          {FEATURES.map(f => (
            <div key={f} style={{ display:"flex", gap:12, alignItems:"center", background:"#13161c", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"16px 20px" }}>
              <span style={{ color:"#68d388", fontSize:18, flexShrink:0 }}>✓</span>
              <span style={{ color:"#f1f5f9", fontSize:14, fontWeight:600 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

    </main>
    <Footer />
  </>
);

export default DownloadPage;
