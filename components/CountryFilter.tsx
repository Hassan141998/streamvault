/**
 * components/CountryFilter.tsx
 */
import { useRouter } from "next/router";

const FILTERS = [
  { label: "All",           color: "#64748b",  href: "/" },
  { label: "🇺🇸 Hollywood", color: "#f43a09",  href: "/discover?region=Hollywood" },
  { label: "🇮🇳 Bollywood", color: "#ffb766",  href: "/discover?region=Bollywood" },
  { label: "🇫🇷 French",    color: "#c2edda",  href: "/discover?region=French" },
  { label: "🇹🇷 Turkish",   color: "#68d388",  href: "/discover?region=Turkish" },
  { label: "🇵🇰 Pakistani", color: "#f43a09",  href: "/discover?region=Pakistani" },
  { label: "🌍 Global",     color: "#a78bfa",  href: "/discover?region=International" },
];

export default function CountryFilter() {
  const router = useRouter();
  const active = (router.query.region as string) ?? "All";

  return (
    <div style={{ padding: "28px 52px 18px", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ color: "#334155", fontSize: 11, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase" as const, marginRight: 8 }}>Browse By</span>
      {FILTERS.map(f => {
        const isActive = active === f.label.replace(/[^a-zA-Z]/g, "") || (active === "All" && f.label === "All");
        return (
          <button key={f.label}
            onClick={() => router.push(f.href)}
            style={{ background: isActive ? f.color : `${f.color}10`, border: `1px solid ${isActive ? f.color : `${f.color}28`}`, color: isActive ? (f.color === "#ffb766" || f.color === "#c2edda" ? "#0c0e12" : "#fff") : f.color, padding: "6px 16px", borderRadius: 24, cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.22s", boxShadow: isActive ? `0 0 16px ${f.color}55` : "none" }}>
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
