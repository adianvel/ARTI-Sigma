import { Shield, Lock, Eye, Database } from "lucide-react"

const PrivacyPolicy = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-8 pt-10 text-as-body">
      <section className="pixel-card px-8 py-12 text-center sm:px-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-as-border px-5 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-as-muted">
          Privacy first
        </span>
        <h1 className="mt-6 text-4xl font-semibold text-as-heading sm:text-5xl">Privacy policy</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-as-muted">
          Arti minimises personal data capture. Showcase metadata is public by design, but you stay
          in control of what gets published.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="pixel-card space-y-3 p-6">
          <div className="inline-flex items-center gap-2 text-as-heading">
            <Lock size={18} />
            <span className="text-sm uppercase tracking-[0.35em] text-as-muted">Minimal capture</span>
          </div>
          <p className="text-sm leading-relaxed text-as-muted">
            We only process information you supply while minting: artwork title, artist name,
            description, medium, edition, and optional duration or dimensions. Wallet addresses are
            stored to determine token ownership.
          </p>
        </article>

        <article className="pixel-card space-y-3 p-6">
          <div className="inline-flex items-center gap-2 text-as-heading">
            <Database size={18} />
            <span className="text-sm uppercase tracking-[0.35em] text-as-muted">
              Storage destinations
            </span>
          </div>
          <p className="text-sm leading-relaxed text-as-muted">
            Showcase metadata is anchored on Cardano and mirrored to IPFS gateways for playback. Arti
            does not operate proprietary databases holding your assets.
          </p>
        </article>

        <article className="pixel-card space-y-3 p-6">
          <div className="inline-flex items-center gap-2 text-as-heading">
            <Eye size={18} />
            <span className="text-sm uppercase tracking-[0.35em] text-as-muted">
              Public transparency
            </span>
          </div>
          <p className="text-sm leading-relaxed text-as-muted">
            Once minted, showcases are publicly viewable so collectors can verify provenance. Avoid
            uploading private data you would not want on-chain.
          </p>
        </article>

        <article className="pixel-card space-y-3 p-6">
          <div className="inline-flex items-center gap-2 text-as-heading">
            <Shield size={18} />
            <span className="text-sm uppercase tracking-[0.35em] text-as-muted">Your rights</span>
          </div>
          <p className="text-sm leading-relaxed text-as-muted">
            You decide what to publish. If you need an asset unpinned from IPFS, contact us at
            privacy@arti.gallery and we will help where feasible. On-chain data cannot be removed.
          </p>
        </article>
      </section>

      <section className="pixel-card p-6 text-sm leading-relaxed text-as-muted">
        <h2 className="text-2xl font-semibold text-as-heading">Data summary</h2>
        <ul className="mt-4 space-y-2 text-as-muted">
          <li>- Art piece metadata: title, artist name, description.</li>
          <li>- Medium and optional edition or duration notes.</li>
          <li>- Primary file reference and media type stored on IPFS.</li>
          <li>- Wallet address used to mint the token.</li>
        </ul>
      </section>

      <section className="rounded-[26px] border border-as-border bg-as-highlight/15 px-6 py-10 text-center">
        <h2 className="text-2xl font-semibold text-as-heading">Need clarification?</h2>
        <p className="mt-3 text-sm leading-relaxed text-as-muted">
          Email privacy@arti.gallery for questions, takedown requests, or compliance concerns.
        </p>
        <p className="mt-2 text-[0.6rem] uppercase tracking-[0.35em] text-as-muted">
          Last updated: October 2025
        </p>
      </section>
    </div>
  )
}

export default PrivacyPolicy
