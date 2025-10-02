import { NFTGallery } from "../components/NFTGallery"
import Link from "next/link"
import { PawPrint } from "lucide-react"

const MyPassportsPage = () => {
  return (
    <section className="space-y-6">
      <header className="mb-4 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">My Cat Crew</h1>
          <p className="text-sm text-slate-500">
            Connect your Eternl wallet to view your Digital Paw-ssports on Cardano Pre-Production.
          </p>
        </div>
        <Link
          href="/mint"
          className="pixel-btn pixel-btn--secondary inline-flex items-center gap-2 px-5 py-2 text-xs"
        >
          <PawPrint size={16} /> Create New Paw-ssport
        </Link>
      </header>

      <NFTGallery apiKey={process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID} />
    </section>
  )
}

export default MyPassportsPage
