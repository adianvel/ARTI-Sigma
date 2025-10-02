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
    <section className="mx-auto flex max-w-4xl flex-col gap-12 text-slate-900 dark:text-slate-100">
      <header className="relative space-y-6 overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <p className="text-sm uppercase tracking-[0.35em] text-blue-600">PetLog V1.1</p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          Create a self-attested digital passport for your cat in minutes.
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-300">
          PetLog transforms your pet&apos;s core identity into a beautiful non-fungible certificate. Mint on the
          Cardano Pre-Production testnet and keep provenance in your wallet forever.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/mint"
            className="pixel-btn pixel-btn--primary inline-flex items-center px-6 py-3 text-xs"
          >
            <span className="inline-flex items-center gap-2">
              <PawPrint size={18} /> Start Creating Now
            </span>
          </Link>
          <Link
            href="/my-passports"
            className="pixel-btn inline-flex items-center bg-white px-6 py-3 text-xs"
          >
            <span className="inline-flex items-center gap-2">
              <Cat size={18} /> View My Cat Crew
            </span>
          </Link>
        </div>
        {/* playful cat illustration */}
        <div aria-hidden className="pointer-events-none absolute -right-6 -bottom-6 opacity-20">
          <Cat size={160} />
        </div>
      </header>

      <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white/80 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        <h2 className="text-lg font-medium">Why PetLog?</h2>
        <ul className="grid gap-4 text-sm text-slate-600 dark:text-slate-300">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                &#10003;
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/70 p-6 text-sm text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
        <p className="font-medium">Coming next</p>
        <p>
          This release focuses on Level 1 self-attested passports. Future versions will introduce verified partners,
          shared galleries, and validation workflows.
        </p>
      </div>
    </section>
  )
}
