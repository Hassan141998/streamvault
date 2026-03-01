/**
 * components/TrailerModal.tsx
 */
export function TrailerModal({ youtubeKey, onClose }: { youtubeKey: string; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease", backdropFilter: "blur(8px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "min(900px,92vw)", aspectRatio: "16/9", position: "relative" }}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&rel=0`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: "none", borderRadius: 16 }}
        />
        <button onClick={onClose} style={{ position: "absolute", top: -44, right: 0, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
      </div>
    </div>
  );
}

export default TrailerModal;
