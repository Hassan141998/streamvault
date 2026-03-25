import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DownloadsPage: NextPage = () => (
  <>
    <Head><title>Download StreamVault App</title></Head>
    <Navbar />
    <main style={{ minHeight: "100vh", background: "#0c0e12" }}>
      <div style={{ padding: "120px 52px 80px", textAlign: "center", background: "radial-gradient(ellipse at 50% 0%, rgba(244,58,9,0.1), transparent 65%)" }}>
        <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(32px,5vw,64px)", fontWeight: 900, color: "#f1f5f9", marginBottom: 14 }}>Download Free.<br /><span style={{ color: "#f43a09" }}>Stream Anywhere.</span></h1>
        <p style={{ color: "#64748b", fontSize: 15, maxWidth: 480, margin: "0 auto 48px", lineHeight: 1.75 }}>Get StreamVault on Android, Windows, or Mac. 4K HDR streaming, offline downloads, no ads.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {[{ icon: "🤖", label: "Android APK", sub: "v3.0 · Android 6.0+", color: "#68d388", dark: "#2e8b4a" },
            { icon: "🪟", label: "Windows",    sub: "v3.0 · Windows 10/11",  color: "#f43a09", dark: "#c4290a" },
            { icon: "🍎", label: "macOS",      sub: "v3.0 · macOS 12+",      color: "#ffb766", dark: "#c4700a" }].map(d => (
            <div key={d.label} style={{ background: "#13161c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "28px 32px", textAlign: "center", minWidth: 200 }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>{d.icon}</div>
              <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>{d.label}</p>
              <p style={{ margin: "0 0 18px", fontSize: 12, color: "#64748b" }}>{d.sub}</p>
              <button style={{ width: "100%", background: `linear-gradient(135deg,${d.dark},${d.color})`, border: "none", color: d.label === "macOS" ? "#0c0e12" : "#fff", padding: "11px 0", borderRadius: 10, fontSize: 13, fontWeight: 800 }}>⬇ Download</button>
            </div>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </>
);
export default DownloadsPage;
