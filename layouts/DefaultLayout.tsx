import Head from "next/head"
import { PropsWithChildren } from "react"
import { Footer } from "components/Footer"
import { Navigation } from "components/Navigation"

export const DefaultLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <>
      <Head>
        <title>Arti - Immersive Art Registry</title>
        <meta
          name="description"
          content="Arti is a curator-grade platform for minting and showcasing immersive video and 3D artworks on Cardano."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-as-background text-as-body antialiased">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
          <Navigation />
          <main className="flex-1 pb-16">{children}</main>
          <Footer />
        </div>
      </div>
    </>
  )
}
