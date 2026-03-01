import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const ERRORS: Record<string,string> = {
  Configuration: "Server config error — check your environment variables.",
  AccessDenied:  "Access denied.",
  Verification:  "Token expired. Try signing in again.",
  Default:       "Something went wrong. Please try again.",
};

const AuthError: NextPage = () => {
  const { query } = useRouter();
  const code = query.error as string;
  const msg  = ERRORS[code] ?? ERRORS.Default;
  return (
    <>
      <Head><title>Auth Error — StreamVault</title></Head>
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0c0e12" }}>
        <div style={{ background:"#13161c", border:"1px solid rgba(244,58,9,0.3)", borderRadius:22, padding:48, maxWidth:440, width:"95vw", textAlign:"center" }}>
          <div style={{ fontSize:52, marginBottom:16 }}>⚠️</div>
          <h1 style={{ fontSize:24, fontWeight:900, color:"#f1f5f9", fontFamily:"'DM Serif Display',serif", marginBottom:12 }}>Sign In Error</h1>
          {code && <p style={{ color:"#64748b", fontSize:13, marginBottom:8 }}>Code: <code style={{ color:"#f43a09" }}>{code}</code></p>}
          <p style={{ color:"#94a3b8", fontSize:14, lineHeight:1.6, marginBottom:28 }}>{msg}</p>
          <Link href="/auth/signin" style={{ display:"inline-block", background:"linear-gradient(135deg,#c4290a,#f43a09)", color:"#fff", padding:"12px 28px", borderRadius:10, fontWeight:800, fontSize:14, marginRight:10 }}>Try Again</Link>
          <Link href="/" style={{ display:"inline-block", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", color:"#94a3b8", padding:"12px 28px", borderRadius:10, fontWeight:600, fontSize:14 }}>Go Home</Link>
        </div>
      </div>
    </>
  );
};
export default AuthError;
