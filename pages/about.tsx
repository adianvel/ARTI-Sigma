import Link from "next/link"
import { Sparkles, Globe2, ShieldCheck, Users } from "lucide-react"

const studioValues = [
  {
    icon: ShieldCheck,
    title: "Preserve intent",
    copy: "Every Arti token is signed with artist-approved metadata that captures narrative, render specs, and licensing guidance.",
  },
  {
    icon: Sparkles,
    title: "Celebrate innovation",
    copy: "We platform moving images, volumetric sculptures, and generative experiments that deserve gallery-grade presentation.",
  },
  {
    icon: Users,
    title: "Bridge communities",
    copy: "Artists, collectors, technologists, and curators collaborate on Arti to build trust around immersive art.",
  },
]

const globalFocus = [
  {
    heading: "Cultural exchanges",
    description:
      "We partner with festivals and residencies to debut time-based works with transparent provenance.",
  },
  {
    heading: "Open tooling",
    description:
      "Our metadata schema is public, composable, and designed to integrate with custom viewers or marketplace rails.",
  },
  {
    heading: "Long-term access",
    description:
      "Media is pinned redundantly across IPFS gateways so drops remain replayable decades from now.",
  },
]

const About = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-10 pt-10 text-as-body">
      <section className="pixel-card px-8 py-12 text-left sm:px-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-as-border px-5 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-as-muted">
          Our intent
        </span>
        <h1 className="mt-6 text-4xl font-semibold text-as-heading sm:text-5xl">About Arti.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-as-muted">
          Arti is a curator-grade registry for video and 3D artists. Born out of collaborations with
          motion designers, immersive storytellers, and digital galleries, we preserve the full
          fidelity of every drop and connect it to a transparent on-chain record.
        </p>
        <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row">
          <Link href="/mint" className="pixel-btn pixel-btn--primary px-6 py-3 text-[0.65rem]">
            Mint a showcase
          </Link>
          <Link href="/contact" className="pixel-btn px-6 py-3 text-[0.65rem]">
            Talk with the team
          </Link>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        {studioValues.map((value) => {
          const Icon = value.icon
          return (
            <article key={value.title} className="pixel-card space-y-4 p-6">
              <div className="rounded-[16px] border border-as-border bg-as-highlight/20 p-3 text-as-heading">
                <Icon size={22} />
              </div>
              <h2 className="text-xl font-semibold text-as-heading">{value.title}</h2>
              <p className="text-sm leading-relaxed text-as-muted">{value.copy}</p>
            </article>
          )
        })}
      </section>

      <section className="pixel-card grid gap-6 px-8 py-12 sm:grid-cols-[1.1fr_1fr] sm:px-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-as-heading">Our global focus.</h2>
          <p className="text-lg leading-relaxed text-as-muted">
            Arti is headquartered between Yogyakarta and Singapore with collaborators in Berlin,
            Seoul, and Sao Paulo. Together we are proving that immersive art deserves a durable,
            interoperable home.
          </p>
          <Link href="/licensing" className="pixel-btn pixel-btn--secondary inline-flex px-6 py-3 text-[0.65rem]">
            Explore licensing
          </Link>
        </div>
        <div className="space-y-4">
          {globalFocus.map((item) => (
            <div
              key={item.heading}
              className="rounded-[18px] border border-as-border bg-as-highlight/15 p-5 text-sm leading-relaxed text-as-muted"
            >
              <p className="text-[0.7rem] uppercase tracking-[0.3em] text-as-heading">
                {item.heading}
              </p>
              <p className="mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pixel-card flex flex-col gap-6 px-8 py-12 sm:px-12">
        <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-as-muted">
          <Globe2 size={16} />
          Community
        </div>
        <h2 className="text-3xl font-semibold text-as-heading">Join the creator circle.</h2>
        <p className="max-w-3xl text-lg leading-relaxed text-as-muted">
          We host quarterly listening sessions with artists, collectors, and partners to co-design
          the roadmap. Contribute ideas, surface needs, or propose collaborations - Arti is built in
          the open.
        </p>
        <div>
          <Link href="/contact" className="pixel-btn px-6 py-3 text-[0.65rem]">
            Share your practice
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About
