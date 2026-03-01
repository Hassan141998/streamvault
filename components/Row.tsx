import { useRef } from "react";
import Card from "./Card";

interface Props { title:string; items:any[]; accent?:string; type:"movie"|"tv"; }

export default function Row({ title, items, accent="#f43a09", type }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d:number) => ref.current?.scrollBy({ left:d*400, behavior:"smooth" });
  if (!items.length) return null;

  return (
    <div style={{ marginBottom:48 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, padding:"0 52px" }}>
        <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:"#f1f5f9", fontFamily:"'DM Serif Display',serif",
          display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ width:3, height:20, background:accent, borderRadius:2, display:"inline-block", boxShadow:`0 0 10px ${accent}` }} />
          {title}
        </h2>
        <div style={{ display:"flex", gap:6 }}>
          {["‹","›"].map((ch,i) => (
            <button key={ch} onClick={()=>scroll(i?1:-1)}
              style={{ background:"#181c24", border:"1px solid rgba(255,255,255,0.07)", color:"#64748b",
                width:30, height:30, borderRadius:"50%", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}
              onMouseEnter={e=>{(e.currentTarget.style.color)="#f1f5f9";(e.currentTarget.style.borderColor)=accent}}
              onMouseLeave={e=>{(e.currentTarget.style.color)="#64748b";(e.currentTarget.style.borderColor)="rgba(255,255,255,0.07)"}}>
              {ch}
            </button>
          ))}
        </div>
      </div>
      <div ref={ref} className="hide-scrollbar"
        style={{ display:"grid", gridAutoFlow:"column", gridAutoColumns:"178px", gridTemplateRows:"1fr",
          gap:14, overflowX:"auto", padding:"8px 52px 16px" }}>
        {items.map(item => <Card key={item.id} item={item} type={type} />)}
      </div>
    </div>
  );
}
