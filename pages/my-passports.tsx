import { NFTGallery } from "../components/NFTGallery"
import Link from "next/link"
import { PawPrint, Heart } from "lucide-react"

const MyPassportsPage = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-8 pt-8">
      {/* Header Section */}
      <section className="rounded-[40px] bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 px-6 py-12 shadow-[0_28px_80px_rgba(244,175,208,0.35)] ring-1 ring-rose-100">
        <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-purple-600 ring-1 ring-purple-200">
              <Heart size={14} />
              My Collection
            </span>
            <h1 className="text-4xl font-semibold text-pl-heading sm:text-5xl">My Pet Crew</h1>
            <p className="text-lg leading-relaxed text-pl-body opacity-80">
              Connect your Eternl wallet to view your Digital Pet Passports on the Cardano Pre-Production network. 
              Your pet's digital identity, secured forever on blockchain.
            </p>
          </div>
          
          <Link
            href="/mint"
            className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 via-rose-500 to-orange-400 p-1 shadow-[0_20px_60px_rgba(168,85,247,0.4)] transition-all duration-300 hover:shadow-[0_30px_80px_rgba(168,85,247,0.6)] hover:-translate-y-1"
          >
            <div className="rounded-full bg-white px-8 py-4 text-base font-bold text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text uppercase tracking-[0.2em] transition-all duration-300 group-hover:from-purple-700 group-hover:via-pink-700 group-hover:to-rose-700">
              <div className="flex items-center gap-3">
                <PawPrint size={20} />
                Create New Passport
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="rounded-[32px] bg-white/80 px-6 py-8 shadow-[0_24px_60px_rgba(212,177,189,0.25)] ring-1 ring-rose-100">
        <NFTGallery apiKey={process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID} />
      </section>
    </div>
  )
}

export default MyPassportsPage


