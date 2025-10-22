import Link from "next/link"
import SplitScreen from "../components/SplitScreen"
import Timeline from "../components/Timeline"
import PreviewCard from "../components/PreviewCard"
import PartnersCarousel from "../components/PartnersCarousel"
import ScrollSequence from "../components/ScrollSequence"

const showcaseHighlights = [
  {
    id: "arti-101",
    title: "Spectral Bloom",
    creator: "Mika Rinaldi",
    format: "8K ray-traced GLB - Spatial audio",
    duration: "03:18 continuous loop",
  },
  {
    id: "arti-102",
    title: "Velvet Frequency",
    creator: "Hanif Ramadhan",
    format: "CinemaScope HDR - MP4",
    duration: "02:04 narrative short",
  },
  {
    id: "arti-103",
    title: "Memory Atlas",
    creator: "Aveline Noor",
    format: "Immersive panorama - WebM",
    duration: "04:45 guided experience",
  },
  {
    id: "arti-104",
    title: "Delta Bloom",
    creator: "Satriya Irawan",
    format: "Realtime shader study - GLTF",
    duration: "Interactive tempo sync",
  },
]

const galleryPillars = [
  {
    title: "Motion preserved",
    description:
      "Encode true-to-studio frame rates, grades, and multi-channel audio so your audience experiences the piece exactly as rendered.",
  },
  {
    title: "3D ready on arrival",
    description:
      "Deliver GLB/GLTF packages with lighting notes and AR fallbacks, viewable directly in the browser or via model-viewer enabled devices.",
  },
  {
    title: "Collector-grade provenance",
    description:
      "Arti tokens carry immutable artist credits, edition notes, and transfer-safe licensing terms anchored on Cardano.",
  },
]

const mintPipeline = [
  {
    label: "Compose",
    detail: "Capture the artist statement, narrative, and staging notes that frame the release.",
  },
  {
    label: "Encode",
    detail: "Upload master video or 3D assets with pristine fidelity - no auto compression, ever.",
  },
  {
    label: "Premiere",
    detail: "Seal the drop on Cardano and share a verifiable showcase link with collectors.",
  },
]

const ecosystemCommitments = [
  {
    heading: "For studios",
    copy: "Manage cinematic drops, stage private previews, and syndicate proof with curators worldwide.",
  },
  {
    heading: "For collectors",
    copy: "Receive archival metadata, verify ownership, and transfer tokens with auditable signatures.",
  },
  {
    heading: "For technologists",
    copy: "Build on a stable metadata schema purpose-built for motion, volumetric capture, and generative work.",
  },
]

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 text-as-body sm:px-6 lg:px-8">
      <section className="pixel-card relative overflow-hidden px-8 py-14 sm:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="relative space-y-8">
          <div className="flex justify-center">
            <img
              src="/logoarti.jpg"
              alt="ARTI Sigma logo"
              className="w-full max-w-sm rounded-[18px] border border-as-border/40 bg-as-surface/80 object-cover shadow-pixel-lg"
            />
          </div>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-6 text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-as-border px-5 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-as-muted font-display">
                Arti - Immersive art registry
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-semibold tracking-[-0.02em] text-as-heading">
                A premium digital canvas for your masterpiece.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-as-muted">
                Mint cinematic videos, volumetric sculptures, and generative worlds with uncompromised
                fidelity. Arti captures your intent, packages the experience, and anchors provenance
                permanently on Cardano.
              </p>
              <div className="flex flex-col items-start gap-4 sm:flex-row">
                <Link href="/mint" className="pixel-btn pixel-btn--primary px-8 py-3 text-[0.65rem]">
                  Mint a new drop
                </Link>
                <Link
                  href="/marketplace"
                  className="pixel-btn pixel-btn--secondary px-8 py-3 text-[0.65rem]"
                >
                  Marketplace
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {showcaseHighlights.map((highlight) => (
                <article
                  key={highlight.id}
                  className="rounded-[18px] border border-as-border bg-as-highlight/20 p-5 text-[0.75rem] uppercase tracking-[0.35em] text-as-muted transition-all duration-300 hover:border-as-borderStrong hover:bg-as-highlight/35"
                >
                  <p className="text-[0.55rem] text-as-muted/70">{highlight.id}</p>
                  <h3 className="mt-2 text-base normal-case tracking-normal text-as-heading">
                    {highlight.title}
                  </h3>
                  <p className="mt-1 text-[0.7rem] normal-case tracking-[0.2em] text-as-muted">
                    {highlight.creator}
                  </p>
                  <div className="mt-4 space-y-2 text-[0.55rem] leading-relaxed text-as-muted/80">
                    <p>{highlight.format}</p>
                    <p>{highlight.duration}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ Problem & Vision Section */}
      <section className="mt-16 grid gap-8 lg:grid-cols-[1fr_1fr] items-center">
        <div className="space-y-6">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-as-muted">Problem & Vision</p>
          <h2 className="text-3xl font-semibold text-as-heading">The Art Market Is Broken — We’re Fixing It.</h2>
          <p className="text-lg leading-relaxed text-as-muted">
            Traditional art markets are centralized, expensive, and limited by geography.
            ARTI Sigma builds a decentralized ecosystem for artists, curators, and collectors — where
            creativity meets blockchain transparency.
          </p>
          {/* Suggestions (developer notes):
            - Split screen: “Old World Art Gallery” (left, grayscale) vs “Decentralized NFT Mint” (right, colorful).
            - Scrolling animation: From Canvas → Token → Investor → Impact.
          */}
        </div>

        <div className="pixel-card p-6">
          <SplitScreen
            leftImage="https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=7a2d6b0d1b9d8f6b62a9a0b1b4c3dcad"
            rightImage="https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=4d6a5b6c7d8e9f0a1b2c3d4e5f6a7b8c"
          />
          <ScrollSequence />
        </div>
      </section>

      {/* 3️⃣ Solution Highlights */}
      <section className="mt-20 rounded-[18px] border border-as-border bg-as-surface/70 p-8">
        <header className="space-y-3 text-center">
          <h2 className="text-2xl font-semibold text-as-heading">Introducing the Phygital Art Tokenization Protocol.</h2>
          <p className="text-as-muted max-w-2xl mx-auto">Convert real artworks into verified NFTs, enable fractional ownership, and power perpetual royalties — all on Cardano.</p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-as-border p-4 text-center">
            <div className="text-2xl">🖼️</div>
            <h4 className="mt-2 font-semibold">Tokenization</h4>
            <p className="mt-1 text-sm text-as-muted">Convert real artworks into verified NFTs</p>
          </div>

          <div className="rounded-lg border border-as-border p-4 text-center">
            <div className="text-2xl">💰</div>
            <h4 className="mt-2 font-semibold">Fractional Ownership</h4>
            <p className="mt-1 text-sm text-as-muted">Let multiple investors co-own one artwork</p>
          </div>

          <div className="rounded-lg border border-as-border p-4 text-center">
            <div className="text-2xl">♻️</div>
            <h4 className="mt-2 font-semibold">Perpetual Royalties</h4>
            <p className="mt-1 text-sm text-as-muted">Set adjustable royalties that last forever</p>
          </div>

          <div className="rounded-lg border border-as-border p-4 text-center">
            <div className="text-2xl">🌐</div>
            <h4 className="mt-2 font-semibold">On-chain Funding</h4>
            <p className="mt-1 text-sm text-as-muted">Crowdfund your art project directly on Cardano</p>
          </div>
        </div>

        <div className="mt-6 text-sm text-as-muted">
          <strong>SEO Phrases:</strong> Art NFT investment, blockchain royalties, phygital collectibles, NFT co-ownership, decentralized art fundraising.
        </div>
      </section>

      {/* 4️⃣ How It Works (Interactive Timeline) */}
      <section className="mt-20">
        <h3 className="text-2xl font-semibold text-as-heading">How It Works</h3>
        <p className="mt-2 text-as-muted">A simple, verifiable flow from creator to collector.</p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div>
              <Timeline />
            </div>

            <aside className="pixel-card p-4">
              <PreviewCard image="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcdef1234567890" />
            </aside>
          </div>
      </section>

      {/* 5️⃣ Business Pillars */}
      <section className="mt-20">
        <h3 className="text-2xl font-semibold text-as-heading">Business Pillars</h3>
        <p className="mt-2 text-as-muted">One platform. Infinite art economies.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            'Art Fundraising DApp',
            'Tokenization Engine',
            'NFT Marketplace',
            'Fractional Ownership',
            'Art-as-Collateral (DeFi)',
            'Stake Pool Operator',
          ].map((p) => (
            <div key={p} className="rounded-lg border border-as-border p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-as-highlight/30 flex items-center justify-center">🔷</div>
              <div>
                <div className="font-semibold">{p}</div>
                <div className="text-sm text-as-muted">Core infrastructure to support creators and investors.</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6️⃣ Market Adoption & Partnerships */}
      <section className="mt-20">
        <h3 className="text-2xl font-semibold text-as-heading">Market Adoption & Partnerships</h3>
        <p className="mt-2 text-as-muted">Building Indonesia’s first blockchain-based art ecosystem.</p>

        <div className="mt-6">
          <PartnersCarousel />
        </div>
      </section>

      {/* 7️⃣ Call to Action */}
      <section className="mt-20 grid gap-6">
        <div className="pixel-card p-6 text-center">
          <h3 className="text-2xl font-semibold text-as-heading">Own a Fraction of the Future of Art.</h3>
          <p className="mt-2 text-as-muted">Start minting or investing today on Cardano Pre-Production Testnet.</p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/mint" className="pixel-btn pixel-btn--primary px-6 py-3">🎨 Create My Art NFT</Link>
            <Link href="/transact" className="pixel-btn pixel-btn--secondary px-6 py-3">💎 Invest in Art Fundraiser</Link>
          </div>
        </div>
      </section>
    </div>
  )
}







