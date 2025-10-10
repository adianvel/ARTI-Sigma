import Link from "next/link"
import { useLucid } from "../contexts/LucidContext"
import { Cat, PawPrint, Shield, Database, Wallet } from "lucide-react"

const features = [
  {
    title: "Self-attested Digital Ownership",
    description: "Create verified digital ownership records that live permanently on blockchain",
    icon: Shield,
    gradient: "from-blue-100 via-sky-50 to-cyan-100",
  },
  {
    title: "IPFS-backed Metadata",
    description: "Your pet's data is stored on IPFS with immutable on-chain proof of authenticity",
    icon: Database,
    gradient: "from-green-100 via-emerald-50 to-teal-100",
  },
  {
    title: "Cardano Native Minting",
    description: "Seamless wallet-native minting flow on Cardano Pre-Production network",
    icon: Wallet,
    gradient: "from-purple-100 via-violet-50 to-indigo-100",
  },
]

export default function Home() {
  const { account } = useLucid()

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="rounded-[40px] bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50 px-6 py-14 shadow-[0_28px_80px_rgba(244,175,208,0.35)] ring-1 ring-rose-100 sm:px-12">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-rose-500 ring-1 ring-white/60">
            PetLog V1.1
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-pl-heading sm:text-5xl md:text-6xl">
            Create a Digital Passport
            <br />
            for Your Pet in Minutes
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pl-body opacity-80">
            PetLog transforms your pet&apos;s core identity into a collectible certificate. Mint on the Cardano Pre-Production testnet and preserve provenance in your wallet forever.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/mint"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300 px-10 py-3 text-base font-semibold uppercase tracking-[0.3em] text-pl-heading shadow-[0_20px_50px_rgba(244,175,208,0.45)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(244,175,208,0.55)]"
            >
              <PawPrint size={18} />
              Start Creating Now
            </Link>
            <Link
              href="/my-passports"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/80 px-10 py-3 text-base font-semibold uppercase tracking-[0.3em] text-pl-heading ring-1 ring-rose-200 shadow-[0_14px_32px_rgba(255,255,255,0.35)] transition duration-200 hover:-translate-y-0.5 hover:bg-white/90"
            >
              <Cat size={18} />
              View My Pet Crew
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-20 rounded-[32px] bg-white/80 px-6 py-12 shadow-[0_24px_60px_rgba(212,177,189,0.25)] ring-1 ring-rose-100 sm:px-12">
        <header className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-500">Why Choose PetLog?</p>
          <h2 className="text-3xl font-semibold text-pl-heading sm:text-4xl">Built for Modern Pet Ownership</h2>
          <p className="text-lg leading-relaxed text-pl-body opacity-80">
            Experience the future of pet documentation with blockchain-powered security and user-friendly design.
          </p>
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={feature.title} className={`rounded-[26px] bg-gradient-to-br ${feature.gradient} p-6 ring-1 ring-white/70 shadow-[0_20px_40px_rgba(0,0,0,0.08)]`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70">
                    <IconComponent size={24} className="text-pl-heading" />
                  </div>
                  <h3 className="text-xl font-semibold text-pl-heading">{feature.title}</h3>
                </div>
                <p className="text-base leading-relaxed text-pl-body opacity-80">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Coming Next Section */}
      <section className="mt-20 rounded-[32px] bg-gradient-to-r from-rose-200/60 via-white/80 to-sky-200/60 px-6 py-12 shadow-[0_20px_60px_rgba(244,175,208,0.28)] ring-1 ring-rose-100 sm:px-12">
        <div className="text-center">
          <div className="mx-auto max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-500">Coming Next</p>
            <h2 className="text-3xl font-semibold text-pl-heading sm:text-4xl">The Future of PetLog</h2>
            <p className="text-lg leading-relaxed text-pl-body opacity-80">
              This release focuses on Level 1 self-attested passports. Future versions will introduce verified partners, shared galleries, and validation workflows.
            </p>
          </div>
          
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="rounded-[24px] bg-white/75 p-6 ring-1 ring-white/70">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 mx-auto">
                <Shield size={20} className="text-rose-600" />
              </div>
              <h3 className="text-lg font-semibold text-pl-heading mb-2">Verified Partners</h3>
              <p className="text-sm text-pl-body opacity-80">Connect with certified breeders and veterinarians</p>
            </div>
            
            <div className="rounded-[24px] bg-white/75 p-6 ring-1 ring-white/70">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mx-auto">
                <Cat size={20} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-pl-heading mb-2">Shared Galleries</h3>
              <p className="text-sm text-pl-body opacity-80">Showcase your pet collection publicly</p>
            </div>
            
            <div className="rounded-[24px] bg-white/75 p-6 ring-1 ring-white/70">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 mx-auto">
                <Database size={20} className="text-sky-600" />
              </div>
              <h3 className="text-lg font-semibold text-pl-heading mb-2">Validation Workflows</h3>
              <p className="text-sm text-pl-body opacity-80">Multi-step verification processes</p>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/mint"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300 px-10 py-3 text-base font-semibold uppercase tracking-[0.3em] text-pl-heading shadow-[0_20px_50px_rgba(244,175,208,0.45)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(244,175,208,0.55)]"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
