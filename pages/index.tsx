import Link from "next/link";
import { motion } from "framer-motion";
import SplitScreen from "../components/SplitScreen";
import Timeline from "../components/Timeline";
import PreviewCard from "../components/PreviewCard";
import PartnersCarousel from "../components/PartnersCarousel";
import ScrollSequence from "../components/ScrollSequence";

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
];

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
];

const mintPipeline = [
  {
    label: "Compose",
    detail:
      "Capture the artist statement, narrative, and staging notes that frame the release.",
  },
  {
    label: "Encode",
    detail:
      "Upload master video or 3D assets with pristine fidelity - no auto compression, ever.",
  },
  {
    label: "Premiere",
    detail:
      "Seal the drop on Cardano and share a verifiable showcase link with collectors.",
  },
];

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
];

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 text-as-body sm:px-6 lg:px-8">
      <motion.section
        className="pixel-card relative overflow-hidden px-8 py-14 sm:px-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{
          scale: 1.01,
          transition: { duration: 0.3 },
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="relative space-y-8">
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            <img
              src="/artisigma-logo-white.png"
              alt="ARTI Sigma logo"
              className="w-full max-w-sm object-cover shadow-pixel-lg"
            />
          </motion.div>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <motion.div
              className="space-y-6 text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              <motion.span
                className="inline-flex items-center gap-2 rounded-full border border-as-border px-5 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-as-muted font-display"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Arti Sigma
              </motion.span>
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-display font-semibold tracking-[-0.02em] text-as-heading"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              >
                A premium digital canvas for your masterpiece.
              </motion.h1>
              <motion.p
                className="max-w-2xl text-lg leading-relaxed text-as-muted"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
              >
                ARTI SIGMA bridges the physical and digital art worlds through
                Phygital Art Tokenization — empowering creators and collectors
                with Fractional NFTs and Adjustable Perpetual Royalties for a
                new era of transparent, on-chain funding.
              </motion.p>
              <motion.div
                className="flex flex-col items-start gap-4 sm:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
              >
                <Link
                  href="/mint"
                  className="pixel-btn pixel-btn--primary px-8 py-3 text-[0.65rem]"
                >
                  Mint a new drop
                </Link>
                <Link
                  href="/marketplace"
                  className="pixel-btn pixel-btn--secondary px-8 py-3 text-[0.65rem]"
                >
                  Marketplace
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            >
              {showcaseHighlights.map((highlight, index) => (
                <motion.article
                  key={highlight.id}
                  className="rounded-[18px] border border-as-border bg-as-highlight/20 p-5 text-[0.75rem] uppercase tracking-[0.35em] text-as-muted transition-all duration-300 hover:border-as-borderStrong hover:bg-as-highlight/35"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.8 + index * 0.1,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    scale: 1.02,
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                >
                  <p className="text-[0.55rem] text-as-muted/70">
                    {highlight.id}
                  </p>
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
                </motion.article>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 2️⃣ Problem & Vision Section */}
      <motion.section
        className="mt-20 grid gap-8 lg:grid-cols-[1fr_1fr] items-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          <motion.p
            className="text-[0.65rem] uppercase tracking-[0.4em] text-as-muted"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Problem & Vision
          </motion.p>
          <motion.h2
            className="text-3xl font-semibold text-as-heading"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          >
            The Art Market Is Broken — We're Fixing It.
          </motion.h2>
          <motion.p
            className="text-lg leading-relaxed text-as-muted"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          >
            Traditional art markets are centralized, expensive, and limited by
            geography. ARTI Sigma builds a decentralized ecosystem for artists,
            curators, and collectors — where creativity meets blockchain
            transparency.
          </motion.p>
        </motion.div>

        <motion.div
          className="pixel-card p-6"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        >
          <SplitScreen
            leftImage="/icons/old_art.png"
            rightImage="/icons/7_ARTI_Icon.png"
          />
          <ScrollSequence />
        </motion.div>
      </motion.section>

      {/* 3️⃣ Solution Highlights */}
      <motion.section
        className="mt-20 rounded-[18px] border border-as-border bg-as-surface/70 p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.header
          className="space-y-3 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-semibold text-as-heading">
            Introducing the Phygital Art Tokenization Protocol.
          </h2>
          <p className="text-as-muted max-w-2xl mx-auto">
            Convert real artworks into verified NFTs, enable fractional
            ownership, and power perpetual royalties — all on Cardano.
          </p>
        </motion.header>

        <motion.div
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {[
            {
              icon: "/icons/11_ARTI_Icon.png",
              title: "Tokenization",
              desc: "Convert real artworks into verified NFTs",
            },
            {
              icon: "/icons/2_ARTI_Icon.png",
              title: "Fractional Ownership",
              desc: "Let multiple investors co-own one artwork",
            },
            {
              icon: "/icons/5_ARTI_Icon.png",
              title: "Perpetual Royalties",
              desc: "Set adjustable royalties that last forever",
            },
            {
              icon: "/icons/7_ARTI_Icon.png",
              title: "On-chain Funding",
              desc: "Crowdfund your art project directly on Cardano",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="rounded-xl border border-as-border bg-as-surface/70 p-6 text-center hover:shadow-as-highlight transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.6 + index * 0.1,
                duration: 0.6,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 },
              }}
            >
              <motion.div
                className="mx-auto w-28 h-28 object-contain mb-4 relative"
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.3 },
                }}
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.8,
                }}
              >
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(47,97,255,0.2)] group-hover:drop-shadow-[0_0_30px_rgba(47,97,255,0.4)] transition-all duration-300"
                />
              </motion.div>
              <h4 className="font-semibold text-lg text-as-heading mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-as-muted leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 text-sm text-as-muted"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <strong>SEO Phrases:</strong> Art NFT investment, blockchain
          royalties, phygital collectibles, NFT co-ownership, decentralized art
          fundraising.
        </motion.div>
      </motion.section>

      {/* 4️⃣ How It Works (Interactive Timeline) */}
      <motion.section
        className="mt-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h3
          className="text-2xl font-semibold text-as-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          How It Works
        </motion.h3>
        <motion.p
          className="mt-2 text-as-muted"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          A simple, verifiable flow from creator to collector.
        </motion.p>

        <motion.div
          className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        >
          <div>
            <Timeline />
          </div>

          <aside className="pixel-card p-4">
            <PreviewCard image="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcdef1234567890" />
          </aside>
        </motion.div>
      </motion.section>

      {/* 5️⃣ Business Pillars */}
      <motion.section
        className="mt-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h3
          className="text-2xl font-semibold text-as-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Business Pillars
        </motion.h3>
        <motion.p
          className="mt-2 text-as-muted"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          One platform. Infinite art economies.
        </motion.p>

        <motion.div
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {[
            "Art Fundraising DApp",
            "Tokenization Engine",
            "NFT Marketplace",
            "Fractional Ownership",
            "Art-as-Collateral (DeFi)",
            "Stake Pool Operator",
          ].map((pillar, index) => (
            <motion.div
              key={pillar}
              className="rounded-lg border border-as-border p-4 flex items-center gap-3 hover:border-as-borderStrong hover:bg-as-highlight/20 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.8 + index * 0.1,
                duration: 0.6,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.02,
                y: -3,
                transition: { duration: 0.2 },
              }}
            >
              <motion.div
                className="h-10 w-10 rounded-full bg-as-highlight/30 flex items-center justify-center"
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.2 },
                }}
              >
                🔷
              </motion.div>
              <div>
                <div className="font-semibold">{pillar}</div>
                <div className="text-sm text-as-muted">
                  Core infrastructure to support creators and investors.
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 6️⃣ Market Adoption & Partnerships */}
      <motion.section
        className="mt-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h3
          className="text-2xl font-semibold text-as-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Market Adoption & Partnerships
        </motion.h3>
        <motion.p
          className="mt-2 text-as-muted"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Building Indonesia's first blockchain-based art ecosystem.
        </motion.p>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        >
          <PartnersCarousel />
        </motion.div>
      </motion.section>

      {/* 7️⃣ Call to Action */}
      <motion.section
        className="mt-20 grid gap-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="pixel-card p-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          <motion.h3
            className="text-2xl font-semibold text-as-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Own a Fraction of the Future of Art.
          </motion.h3>
          <motion.p
            className="mt-2 text-as-muted"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Start minting or investing today on Cardano Pre-Production Testnet.
          </motion.p>
          <motion.div
            className="mt-4 flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2 },
              }}
            >
              <Link
                href="/mint"
                className="pixel-btn pixel-btn--primary px-6 py-3"
              >
                🎨 Create My Art NFT
              </Link>
            </motion.div>
            <motion.div
              whileHover={{
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2 },
              }}
            >
              <Link
                href="/transact"
                className="pixel-btn pixel-btn--secondary px-6 py-3"
              >
                💎 Invest in Art Fundraiser
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
}
