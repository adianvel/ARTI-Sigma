import Link from "next/link"

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
              <span className="inline-flex items-center gap-2 rounded-full border border-as-border px-5 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-as-muted">
                Arti - Immersive art registry
              </span>
              <h1 className="text-4xl font-semibold text-as-heading sm:text-5xl">
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
                  href="/my-passports"
                  className="pixel-btn pixel-btn--secondary px-8 py-3 text-[0.65rem]"
                >
                  Enter my gallery
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

      <section className="mt-16 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-as-heading">A gallery without walls.</h2>
          <p className="text-lg leading-relaxed text-as-muted">
            The public registry surfaces the most daring video, 3D, and generative art releases from
            around the globe. Browse pristine playback, explore edition notes, and validate
            provenance instantly.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {showcaseHighlights.map((highlight) => (
              <div
                key={highlight.id}
                className="rounded-[18px] border border-as-border bg-as-surface/80 p-4 text-[0.65rem] uppercase tracking-[0.35em] text-as-muted"
              >
                <p className="text-as-muted/60">{highlight.creator}</p>
                <p className="mt-2 text-sm normal-case tracking-[0.2em] text-as-heading">
                  {highlight.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pixel-card space-y-5 p-6">
          <h3 className="text-xl font-semibold uppercase tracking-[0.3em] text-as-heading">
            Gallery pillars
          </h3>
          <ul className="space-y-4 text-sm leading-relaxed text-as-muted">
            {galleryPillars.map((pillar) => (
              <li key={pillar.title} className="rounded-[16px] border border-as-border p-4">
                <p className="text-[0.75rem] uppercase tracking-[0.3em] text-as-heading">
                  {pillar.title}
                </p>
                <p className="mt-2">{pillar.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-20 rounded-[26px] border border-as-border bg-as-surface/70 p-8">
        <header className="space-y-3 text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-as-muted">Minting cadence</p>
          <h2 className="text-3xl font-semibold text-as-heading">From render queue to registry.</h2>
        </header>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {mintPipeline.map((step, index) => (
            <article
              key={step.label}
              className="rounded-[18px] border border-as-border bg-as-highlight/25 p-6 text-sm leading-relaxed text-as-muted"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-as-muted/80">
                Step {index + 1}
              </p>
              <h3 className="mt-3 text-base font-semibold text-as-heading">{step.label}</h3>
              <p className="mt-3 text-as-muted">{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="pixel-card p-7">
          <h3 className="text-2xl font-semibold text-as-heading">Why artists join Arti</h3>
          <p className="mt-4 text-as-muted">
            We collaborate with motion designers, realtime artists, and digital galleries to capture
            the full intent of every project. From color grading data to spatial audio stems, every
            detail is preserved.
          </p>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed text-as-muted">
            <li>- Custom metadata schema for video, volumetric, and generative formats.</li>
            <li>- Redundant IPFS pinning with verified playback endpoints.</li>
            <li>- Cardano-native issuance with upgradeable display tooling.</li>
          </ul>
        </div>

        <div className="pixel-card p-7">
          <h3 className="text-2xl font-semibold text-as-heading">Ecosystem commitments</h3>
          <p className="mt-4 text-as-muted">
            Whether you are staging a premiere, collecting a series, or integrating with tooling,
            Arti provides a stable, transparent framework for immersive art.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {ecosystemCommitments.map((item) => (
              <div
                key={item.heading}
                className="rounded-[18px] border border-as-border bg-as-highlight/20 p-4 text-sm text-as-muted"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-as-muted/60">
                  {item.heading}
                </p>
                <p className="mt-2">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}







