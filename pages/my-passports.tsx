import { NFTGallery } from "../components/NFTGallery"
import Link from "next/link"
import { PawPrint } from "lucide-react"

const MyPassportsPage = () => {
  return (
    <section className="space-y-8 text-pl-body">
      <header className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div className="space-y-2">
          <h1 className="font-display text-4xl tracking-[0.25em] text-pl-heading">My Cat Crew</h1>
          <p className="text-lg leading-relaxed text-pl-muted">
            Connect your Eternl wallet to view your Digital Paw-ssports on the Cardano Pre-Production network.
          </p>
        </div>
        <Link
          href="/mint"
          className="pixel-btn pixel-btn--secondary inline-flex items-center gap-2 px-6 py-3 text-base uppercase tracking-[0.3em]"
        >
          <PawPrint size={16} aria-hidden /> Create New Paw-ssport
        </Link>
      </header>

      <NFTGallery apiKey={process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID} />
    </section>
  )
}

export default MyPassportsPage


