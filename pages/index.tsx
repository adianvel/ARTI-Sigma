import Link from "next/link"

const passportShowcase = [
  {
    id: "captain-luna",
    name: "Luna",
    lineage: "Silver Bengal - Born 2021",
    badge: "Starlight Navigator",
    gradient: "from-rose-200 via-amber-100 to-orange-100",
  },
  {
    id: "mochi",
    name: "Mochi",
    lineage: "Ragdoll - Born 2020",
    badge: "Cuddle Diplomat",
    gradient: "from-sky-200 via-rose-100 to-slate-100",
  },
  {
    id: "aster",
    name: "Aster",
    lineage: "Scottish Fold - Born 2023",
    badge: "Whisker Archivist",
    gradient: "from-lime-200 via-emerald-100 to-teal-100",
  },
  {
    id: "pixel",
    name: "Pixel",
    lineage: "Sphynx - Born 2019",
    badge: "Warmth Seeker",
    gradient: "from-violet-200 via-rose-100 to-indigo-100",
  },
]

const highlights = [
  {
    title: "Ownable identity",
    description: "Turn your cat&apos;s story into a collectible NFT passport anchored on the Cardano Pre-Production network.",
  },
  {
    title: "Guided storytelling",
    description: "Gather photos, traits, and treasured memories with a cozy, step-by-step minting flow.",
  },
  {
    title: "Gallery ready",
    description: "Every minted passport lives in a soft gallery so you can show off your feline crew in style.",
  },
]

const flowSteps = [
  {
    step: "Preview the vibe",
    detail: "Flip through the sample passports to imagine how your cat&apos;s personality will shine in the final NFT.",
  },
  {
    step: "Collect the details",
    detail: "Note birthdays, microchip numbers, and quirks now so minting on PetLog feels effortless later.",
  },
  {
    step: "Mint with confidence",
    detail: "Tap the button, head into the PetLog app, and turn your cat&apos;s story into a Level 1 digital paw-ssport.",
  },
]

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <section className="rounded-[40px] bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50 px-6 py-14 shadow-[0_28px_80px_rgba(244,175,208,0.35)] ring-1 ring-rose-100 sm:px-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-rose-500 ring-1 ring-white/60">
              Cardano Pre-Production
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-pl-heading sm:text-5xl md:text-6xl">
              Welcome to the PetLog Crew.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-pl-body opacity-80">
              Meet PetLog&apos;s warm, friendly universe before you ever connect a wallet. Explore the art direction, picture your cat&apos;s debut, and join the crew when you are ready to mint.
            </p>
            <Link
              href="/app"
              className="inline-flex w-fit items-center justify-center rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300 px-10 py-3 text-base font-semibold uppercase tracking-[0.3em] text-pl-heading shadow-[0_20px_50px_rgba(244,175,208,0.45)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(244,175,208,0.55)]"
            >
              Create a Paw-ssport
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {passportShowcase.map((passport) => (
              <article
                key={passport.id}
                className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br ${passport.gradient} p-6 shadow-[0_20px_55px_rgba(212,177,189,0.32)] ring-1 ring-white/60`}
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-pl-muted">
                  <span>PetLog</span>
                  <span>Level 1</span>
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-pl-heading">{passport.name}</h2>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.25em] text-pl-muted">{passport.lineage}</p>
                <div className="mt-6 rounded-[20px] bg-white/70 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-pl-heading shadow-[0_14px_32px_rgba(255,255,255,0.35)]">
                  {passport.badge}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20 rounded-[32px] bg-white/80 px-6 py-12 shadow-[0_24px_60px_rgba(212,177,189,0.25)] ring-1 ring-rose-100 sm:px-12">
        <header className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-500">Why cat parents love PetLog</p>
          <h2 className="text-3xl font-semibold text-pl-heading sm:text-4xl">A keepsake before any wallet click.</h2>
          <p className="text-lg leading-relaxed text-pl-body opacity-80">
            Fall in love with the concept first. PetLog keeps things light, warm, and welcoming so you arrive in the dApp with a clear vision of the passport you want to mint.
          </p>
        </header>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {highlights.map((highlight) => (
            <div key={highlight.title} className="flex flex-col gap-3 rounded-[26px] bg-gradient-to-br from-white/90 to-rose-50/90 p-6 ring-1 ring-white/70">
              <h3 className="text-xl font-semibold text-pl-heading">{highlight.title}</h3>
              <p className="text-base leading-relaxed text-pl-body opacity-80">{highlight.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-[32px] bg-gradient-to-r from-rose-200/60 via-white/80 to-sky-200/60 px-6 py-12 shadow-[0_20px_60px_rgba(244,175,208,0.28)] ring-1 ring-rose-100 sm:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-500">How it flows</p>
          <h2 className="mt-4 text-3xl font-semibold text-pl-heading sm:text-4xl">Imagine, prepare, and then mint with ease.</h2>
          <p className="mt-4 text-lg leading-relaxed text-pl-body opacity-80">
            Follow these steps to bring your cat&apos;s story into the PetLog app without any surprises. The marketing flow is your runway; the dApp is your takeoff.
          </p>
          <div className="mt-10 grid gap-6 text-left sm:grid-cols-3">
            {flowSteps.map((item, index) => (
              <div key={item.step} className="rounded-[24px] bg-white/75 p-6 ring-1 ring-white/70">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-400 text-lg font-semibold text-white">
                  {index + 1}
                </span>
                <p className="mt-4 text-base font-semibold text-pl-heading">{item.step}</p>
                <p className="mt-2 text-sm leading-relaxed text-pl-body opacity-80">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
