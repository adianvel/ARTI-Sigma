import Link from "next/link"
import { useLucid } from "../contexts/LucidContext"
import { Cat, PawPrint } from "lucide-react"

const features = [
  "Self-attested digital ownership records",
  "IPFS-backed metadata with on-chain proof",
  "Wallet-native minting flow on Cardano Pre-Production",
]

export default function Home() {
  const { account } = useLucid()

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-12 text-pl-body">
      <header className="pixel-card pixel-dither relative overflow-hidden p-8 text-center">
        <p className="text-base uppercase tracking-[0.4em] text-pl-muted">PetLog V1.1</p>
        <h1 className="mt-4 font-display text-5xl tracking-[0.18em] text-pl-heading sm:text-5xl">
          Create a self-attested digital passport for your cat in minutes.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-pl-body">
          PetLog transforms your pet&apos;s core identity into a collectible certificate. Mint on the Cardano Pre-Production testnet and preserve provenance in your wallet forever.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/mint"
            className="pixel-btn pixel-btn--primary inline-flex items-center gap-2 px-6 py-3 text-base uppercase tracking-[0.4em]"
          >
            <PawPrint size={18} aria-hidden /> Start Creating Now
          </Link>
          <Link
            href="/my-passports"
            className="pixel-btn inline-flex items-center gap-2 px-6 py-3 text-base uppercase tracking-[0.4em]"
          >
            <Cat size={18} aria-hidden /> View My Cat Crew
          </Link>
        </div>
        <div aria-hidden className="pointer-events-none absolute -bottom-8 right-8 opacity-15">
          <Cat size={180} />
        </div>
      </header>

      <div className="pixel-card space-y-6 p-6">
        <h2 className="font-display text-lg tracking-[0.2em] text-pl-heading">Why PetLog?</h2>
        <ul className="grid gap-4 text-base leading-relaxed text-pl-body">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-[3px] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-pixel border border-pl-borderStrong bg-pl-highlight font-display text-xs tracking-[0.2em] text-pl-heading">
                ✓
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pixel-banner p-6 text-base leading-relaxed text-pl-heading">
        <p className="font-display text-lg tracking-[0.2em]">Coming next</p>
        <p className="mt-2 text-pl-body">
          This release focuses on Level 1 self-attested passports. Future versions will introduce verified partners,
          shared galleries, and validation workflows.
        </p>
      </div>
    </section>
  )
}

