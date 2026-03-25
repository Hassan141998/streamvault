import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Toaster position="bottom-right" toastOptions={{ style: { background: "#13161c", color: "#f1f5f9", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", fontSize: "13px" } }} />
    </SessionProvider>
  );
}
