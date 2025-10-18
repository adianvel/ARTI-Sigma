import Link from "next/link"
import { useLucid } from "../contexts/LucidContext"
import { Film, Upload, Share2, Sparkles, Layers, Cpu, Headphones, Video } from "lucide-react"

const studioModules = [
  {
    icon: Upload,
    title: "Stage assets",
    blurb: "Ingest master renders, volumetric captures, and audio stems without automatic compression.",
  },
  {
    icon: Film,
    title: "Author narrative",
    blurb: "Compose statements, lighting notes, and viewing instructions that travel with every collector.",
  },
  {
    icon: Share2,
    title: "Premiere drop",
    blurb: "Mint the Arti token, publish a showcase link, and control who previews before the release date.",
  },
]

const roadmap = [
  {
    label: "Real-time playback metrics",
    description: "Expose viewer stats and performance diagnostics for large-scale installations.",
  },
  {
    label: "Render farm signing",
    description: "Let trusted pipelines sign outputs so collectors can verify provenance from source files.",
  },
  {
    label: "Collaborative editions",
    description: "Co-author drops with multi-artist attribution, split licensing, and shared storefronts.",
  },
]

const formatSupport = [
  {
    icon: Layers,
    title: "Volumetric ready",
    copy: "GLB, GLTF, USDZ, and WebXR packages render in-browser with optional AR staging.",
  },
  {
    icon: Video,
    title: "Cinematic masters",
    copy: "Preserve HDR colour profiles, surround audio, and subtitles across MP4 or WebM releases.",
  },
  {
    icon: Headphones,
    title: "Spatial sound",
    copy: "Attach stem breakdowns, tempo maps, and album art for audio-reactive installations.",
  },
  {
    icon: Cpu,
    title: "Generative archives",
    copy: "Encode source seeds, shader parameters, and replay instructions for live code works.",
  },
]

export default function Studio() {
  const { account } = useLucid()

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 text-as-body sm:px-6 lg:px-8">
      <section className="pixel-card overflow-hidden px-8 py-14 sm:px-12">
        <div className="space-y-6 text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-as-border px-5 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-as-muted">
            Arti Studio   - Creator console
          </span>
          <h1 className="text-4xl font-semibold text-as-heading sm:text-5xl">
            Orchestrate your immersive releases.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-as-muted">
            Arti Studio keeps every video, 3D, and generative asset aligned. Stage the narrative,
            certify the media, and deliver collector-ready experiences in minutes.
          </p>
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <Link href="/mint" className="pixel-btn pixel-btn--primary px-8 py-3 text-[0.65rem]">
              {account ? "Mint new showcase" : "Connect to mint"}
            </Link>
            <Link href="/my-passports" className="pixel-btn pixel-btn--secondary px-8 py-3 text-[0.65rem]">
              View my collection
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="pixel-card space-y-6 p-8">
          <h2 className="text-2xl font-semibold text-as-heading">Studio modules</h2>
          <p className="text-as-muted">
            Follow the guided workflow to build a collector-grade release. Each module is optimised
            for moving images, volumetric capture, and audio-reactive works.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {studioModules.map((module) => {
              const Icon = module.icon
              return (
                <div
                  key={module.title}
                  className="rounded-[18px] border border-as-border bg-as-highlight/25 p-4 text-sm leading-relaxed text-as-muted"
                >
                  <Icon className="mb-3 text-as-heading" size={20} />
                  <p className="text-[0.75rem] uppercase tracking-[0.35em] text-as-heading">
                    {module.title}
                  </p>
                  <p className="mt-2">{module.blurb}</p>
                </div>
              )
            })}
          </div>
        </div>

        <aside className="pixel-card flex flex-col gap-5 p-8">
          <h3 className="text-xl font-semibold text-as-heading">Connection status</h3>
          {account ? (
            <div className="rounded-[16px] border border-as-border bg-as-highlight/25 p-4 text-sm text-as-muted">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-as-muted/80">
                Wallet connected
              </p>
              <p className="mt-2 break-all font-mono text-[0.7rem] uppercase tracking-[0.25em] text-as-heading">
                {account.address}
              </p>
            </div>
          ) : (
            <div className="rounded-[16px] border border-as-border bg-as-highlight/25 p-4 text-sm text-as-muted">
              Connect a Cardano wallet to unlock the minting console.
            </div>
          )}
          <Link href="/mint" className="pixel-btn px-6 py-3 text-[0.65rem]">
            {account ? "Launch minting console" : "Connect wallet"}
          </Link>
        </aside>
      </section>

      <section className="mt-20 rounded-[26px] border border-as-border bg-as-surface/70 p-8">
        <header className="space-y-3">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-as-muted">Roadmap</p>
          <h2 className="text-3xl font-semibold text-as-heading">What arrives next.</h2>
        </header>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {roadmap.map((item) => (
            <div
              key={item.label}
              className="rounded-[18px] border border-as-border bg-as-highlight/25 p-5 text-sm leading-relaxed text-as-muted"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-as-muted/70">
                {item.label}
              </p>
              <p className="mt-3">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-8 lg:grid-cols-2">
        <div className="pixel-card p-8">
          <h3 className="text-2xl font-semibold text-as-heading">Immersive format support</h3>
          <p className="mt-4 text-as-muted">
            Arti handles the pipelines modern artists rely on, from volumetric sculpture to
            feature-length video. Your media is preserved exactly as exported.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {formatSupport.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="rounded-[18px] border border-as-border bg-as-highlight/20 p-4 text-sm leading-relaxed text-as-muted"
                >
                  <Icon className="mb-3 text-as-heading" size={18} />
                  <p className="text-[0.7rem] uppercase tracking-[0.3em] text-as-heading">
                    {item.title}
                  </p>
                  <p className="mt-2">{item.copy}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="pixel-card p-8">
          <h3 className="text-2xl font-semibold text-as-heading">Built with collaborators</h3>
          <p className="mt-4 text-as-muted">
            Arti is shaped by directors, realtime artists, and digital galleries redefining how
            audiences experience motion. Join the creator circle and influence upcoming tooling.
          </p>
          <div className="mt-6 grid gap-3 text-sm uppercase tracking-[0.3em] text-as-muted">
            <div className="rounded-[16px] border border-as-border bg-as-highlight/20 px-4 py-3">
              <Sparkles size={14} className="mr-2 inline-block text-as-heading" />
              Festivals & premieres
            </div>
            <div className="rounded-[16px] border border-as-border bg-as-highlight/20 px-4 py-3">
              <Layers size={14} className="mr-2 inline-block text-as-heading" />
              Digital galleries
            </div>
            <div className="rounded-[16px] border border-as-border bg-as-highlight/20 px-4 py-3">
              <Cpu size={14} className="mr-2 inline-block text-as-heading" />
              Creative technologists
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
