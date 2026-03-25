import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
const inp: React.CSSProperties = {width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"12px 15px",color:"#f1f5f9",fontSize:14,marginBottom:12,outline:"none"};
const SignIn: NextPage = () => {
  const router = useRouter();
  const [mode,setMode]=useState<"in"|"up">("in");
  const [name,setName]=useState("");const [email,setEmail]=useState("");const [pass,setPass]=useState("");const [load,setLoad]=useState(false);
  async function submit(e:React.FormEvent){e.preventDefault();setLoad(true);
    if(mode==="in"){const r=await signIn("credentials",{email,password:pass,redirect:false});if(r?.ok){toast.success("Welcome! 🎬");router.push("/");}else toast.error("Invalid email or password");}
    else{const r=await fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,password:pass})});const d=await r.json();if(r.ok){toast.success("Account created!");await signIn("credentials",{email,password:pass,redirect:false});router.push("/");}else toast.error(d.error??"Registration failed");}
    setLoad(false);}
  return (<>
    <Head><title>{mode==="in"?"Sign In":"Sign Up"} — StreamVault</title></Head>
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"radial-gradient(ellipse at 30% 40%, rgba(244,58,9,0.07), transparent 60%), #0c0e12"}}>
      <div style={{background:"#13161c",border:"1px solid rgba(255,255,255,0.07)",borderRadius:24,padding:48,width:420,maxWidth:"95vw",boxShadow:"0 40px 80px rgba(0,0,0,0.7)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <Link href="/" style={{fontFamily:"'DM Serif Display',serif",fontSize:26,fontWeight:900,color:"#f1f5f9"}}>Stream<span style={{color:"#f43a09"}}>Vault</span></Link>
          <p style={{color:"#64748b",fontSize:13,marginTop:6}}>{mode==="in"?"Welcome back":"Create free account"}</p>
        </div>
        <div style={{background:"rgba(104,211,136,0.06)",border:"1px solid rgba(104,211,136,0.2)",borderRadius:10,padding:"10px 14px",marginBottom:20,fontSize:12,color:"#68d388"}}>💡 Demo: <strong>demo@streamvault.com</strong> / <strong>demo1234</strong></div>
        <form onSubmit={submit}>
          {mode==="up"&&<input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" required style={inp}/>}
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" required style={inp}/>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder={mode==="up"?"Password (8+ chars)":"Password"} required style={inp}/>
          <button type="submit" disabled={load} style={{width:"100%",background:"linear-gradient(135deg,#c4290a,#f43a09)",border:"none",color:"#fff",padding:"13px 0",borderRadius:10,fontSize:15,fontWeight:800,opacity:load?0.7:1,boxShadow:"0 0 24px rgba(244,58,9,0.4)",marginTop:4}}>{load?"Please wait…":mode==="in"?"Sign In":"Create Account"}</button>
        </form>
        <p style={{textAlign:"center",color:"#64748b",fontSize:13,marginTop:18}}>{mode==="in"?"No account? ":"Already registered? "}<button onClick={()=>setMode(m=>m==="in"?"up":"in")} style={{background:"none",border:"none",color:"#68d388",fontSize:13,fontWeight:700}}>{mode==="in"?"Sign up free":"Sign in"}</button></p>
        <p style={{textAlign:"center",marginTop:10}}><Link href="/" style={{color:"#334155",fontSize:12}}>← Back to home</Link></p>
      </div>
    </div>
  </>);
};
export const getServerSideProps: GetServerSideProps = async (ctx) => { const s=await getSession(ctx); if(s) return {redirect:{destination:"/",permanent:false}}; return {props:{}}; };
export default SignIn;
