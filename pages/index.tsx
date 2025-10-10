import Link from "next/link"

const problemCards = [
  {
    title: "Fake Pedigree Certificates",
    stat: "42% of pedigree certificates in Asia are unverifiable",
    description: "Too many breeders still rely on paper-based proof that can be forged, lost, or duplicated — breaking trust between buyers and associations.",
    source: "(Source: Asian Kennel Network, 2024)",
    gradient: "from-red-100 via-rose-50 to-pink-100",
  },
  {
    title: "Scattered Vaccine & Health Records",
    stat: "73% of veterinary clinics in Indonesia still use manual or Excel-based records",
    description: "When health data lives in silos, owners lose track and vets lose visibility.",
    source: "(Source: Indonesian Veterinary Association, 2023)",
    gradient: "from-orange-100 via-amber-50 to-yellow-100",
  },
  {
    title: "Fragmented & Unverified Pet Data",
    description: "There's no standardized system to verify a pet's lineage, vaccine history, or ownership — especially in developing markets. That means one thing: no real proof of authenticity or care.",
    gradient: "from-blue-100 via-sky-50 to-cyan-100",
  },
]

const solutionCards = [
  {
    title: "Immutable Lineage Record",
    description: "Pedigree data from certified breeders is stored directly on blockchain, verifiable anytime.",
    impact: "Eliminates up to 90% of fake pedigree cases.",
    gradient: "from-green-100 via-emerald-50 to-teal-100",
    emoji: "🧬",
  },
  {
    title: "Verified Vaccine & Health Log",
    description: "Veterinary clinics digitally sign every vaccination and health update — ensuring traceable, tamper-proof medical history.",
    impact: "Guarantees 100% data integrity across connected clinics.",
    gradient: "from-blue-100 via-cyan-50 to-sky-100",
    emoji: "💉",
  },
  {
    title: "NFT Pet Passport",
    description: "Each pet receives a unique NFT ID — containing verified lineage, vaccine, and health metadata — transferable between owners or breeders.",
    impact: "Transparency that travels with every pet.",
    gradient: "from-purple-100 via-violet-50 to-indigo-100",
    emoji: "🪪",
  },
]

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="rounded-[40px] bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50 px-6 py-14 shadow-[0_28px_80px_rgba(244,175,208,0.35)] ring-1 ring-rose-100 sm:px-12">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-rose-500 ring-1 ring-white/60">
            Blockchain Pet Registry
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-pl-heading sm:text-5xl md:text-6xl">
            Your Pet&apos;s Legacy,
            <br />
            Written on Blockchain.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pl-body opacity-80">
            PetLog connects every pet&apos;s lineage, vaccine, and health record into one verifiable digital identity.
          </p>
          <Link
            href="/app"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300 px-10 py-3 text-base font-semibold uppercase tracking-[0.3em] text-pl-heading shadow-[0_20px_50px_rgba(244,175,208,0.45)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(244,175,208,0.55)]"
          >
            Create Pet Passport
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section className="mt-20 rounded-[32px] bg-white/80 px-6 py-12 shadow-[0_24px_60px_rgba(212,177,189,0.25)] ring-1 ring-rose-100 sm:px-12">
        <header className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-500">🐾 The Problem</p>
          <h2 className="text-3xl font-semibold text-pl-heading sm:text-4xl">A Broken System of Trust in Pet Ownership</h2>
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {problemCards.map((card, index) => (
            <div key={card.title} className={`rounded-[26px] bg-gradient-to-br ${card.gradient} p-6 ring-1 ring-white/70 shadow-[0_20px_40px_rgba(0,0,0,0.08)]`}>
              <h3 className="text-xl font-semibold text-pl-heading">{card.title}</h3>
              {card.stat && (
                <div className="mt-4 rounded-lg bg-white/70 px-4 py-3">
                  <p className="text-sm font-bold text-red-700">{card.stat}</p>
                </div>
              )}
              <p className="mt-4 text-base leading-relaxed text-pl-body opacity-80">{card.description}</p>
              {card.source && (
                <p className="mt-3 text-xs italic text-pl-body opacity-60">{card.source}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg italic text-pl-body opacity-70">
            💬 &ldquo;When data is fragmented, trust disappears.&rdquo;
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="mt-20 rounded-[32px] bg-gradient-to-r from-rose-200/60 via-white/80 to-sky-200/60 px-6 py-12 shadow-[0_20px_60px_rgba(244,175,208,0.28)] ring-1 ring-rose-100 sm:px-12">
        <header className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-500">💡 The Solution</p>
          <h2 className="text-3xl font-semibold text-pl-heading sm:text-4xl">PetLog — A Decentralized Trust Layer for Pets</h2>
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {solutionCards.map((card, index) => (
            <div key={card.title} className={`rounded-[26px] bg-gradient-to-br ${card.gradient} p-6 ring-1 ring-white/70 shadow-[0_20px_40px_rgba(0,0,0,0.08)]`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{card.emoji}</span>
                <h3 className="text-xl font-semibold text-pl-heading">{card.title}</h3>
              </div>
              <p className="text-base leading-relaxed text-pl-body opacity-80 mb-4">{card.description}</p>
              <div className="rounded-lg bg-white/70 px-4 py-3">
                <p className="text-sm font-bold text-green-700">{card.impact}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Validator Network Section */}
        <div className="mt-12 rounded-[26px] bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100 p-8 ring-1 ring-white/70 shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔗</span>
            <h3 className="text-2xl font-semibold text-pl-heading">Validator Network</h3>
          </div>
          <p className="text-lg leading-relaxed text-pl-body opacity-80 mb-6">
            Pedigree associations and veterinary clinics act as trusted validators in the ecosystem, creating a decentralized network of verified pet data.
          </p>
          <div className="rounded-lg bg-white/70 px-6 py-4">
            <p className="text-base font-bold text-purple-700">Building a trusted digital identity layer for the pet industry.</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/app"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300 px-10 py-3 text-base font-semibold uppercase tracking-[0.3em] text-pl-heading shadow-[0_20px_50px_rgba(244,175,208,0.45)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(244,175,208,0.55)]"
          >
            Start Building Trust
          </Link>
        </div>
      </section>
    </div>
  )
}
