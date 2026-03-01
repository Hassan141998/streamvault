/**
 * components/DownloadCTA.tsx
 */
import Link from "next/link";

export default function DownloadCTA() {
  return (
    <div style={{ margin: "0 52px 52px", borderRadius: 22, position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#13161c,#181c24)", border: "1px solid rgba(255,255,255,0.07)", padding: "40px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "linear-gradient(to bottom,#f43a09,#ffb766,#68d388,#c2edda)" }} />
      <div>
        <div style={{ fontSize: 12, color: "#68d388", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase" as const, marginBottom: 10 }}>Free Download</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 900, fontFamily: "'DM Serif Display',serif", color: "#f1f5f9" }}>Available on Android, Windows & Mac</h3>
        <p style={{ margin: 0, color: "#64748b", fontSize: 14, maxWidth: 440, lineHeight: 1.7 }}>Stream in 4K, download for offline viewing, 5 profiles per account — all included free.</p>
      </div>
      <div style={{ display: "flex", gap: 11, flexWrap: "wrap" }}>
        <Link href="/downloads" style={{ background: "linear-gradient(135deg,#2e8b4a,#68d388)", border: "none", color: "#0c0e12", padding: "12px 24px", borderRadius: 10, fontSize: 13, fontWeight: 800, textDecoration: "none", boxShadow: "0 0 22px rgba(104,211,136,0.4)", display: "inline-block" }}>🤖 Android APK</Link>
        <Link href="/downloads" style={{ background: "linear-gradient(135deg,#c4290a,#f43a09)", border: "none", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 13, fontWeight: 800, textDecoration: "none", boxShadow: "0 0 22px rgba(244,58,9,0.4)", display: "inline-block" }}>💻 PC / Mac</Link>
      </div>
    </div>
  );
}
