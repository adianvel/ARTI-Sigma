import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/artisigma-logo-blue.png" />
        <link rel="apple-touch-icon" href="/artisigma-logo-blue.png" />
        <meta name="theme-color" content="#2F61FF" />
        <meta property="og:title" content="ARTI Sigma — Phygital Art Tokenization" />
        <meta property="og:description" content="Tokenize phygital art, fractional ownership, and perpetual royalties on Cardano." />
        <meta property="og:image" content="/artisigma-logo-blue.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/artisigma-logo-blue.png" />
      </Head>

      <body>
        <Main />

        <NextScript />
      </body>
    </Html>
  )
}
