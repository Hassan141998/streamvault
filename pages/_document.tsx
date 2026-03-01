import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23f43a09'/><text y='.9em' font-size='65' x='18'>▶</text></svg>" />
        <meta name="theme-color" content="#0c0e12" />
        <meta name="description" content="StreamVault — Watch movies and TV series in 4K free" />
      </Head>
      <body><Main /><NextScript /></body>
    </Html>
  );
}
