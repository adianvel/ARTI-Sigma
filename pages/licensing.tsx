import { Scale, Code, FileText, Shield } from "lucide-react"

const Licensing = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-8 pt-10 text-as-body">
      <section className="pixel-card px-8 py-12 text-center sm:px-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-as-border px-5 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-as-muted">
          Open licensing
        </span>
        <h1 className="mt-6 text-4xl font-semibold text-as-heading sm:text-5xl">
          Arti licensing.
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-as-muted">
          Arti is committed to transparent tooling. The core platform is open source, while certain
          brand assets remain protected until general launch.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="pixel-card space-y-4 p-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-as-border px-4 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-as-muted">
            <Code size={16} />
            Source code
          </div>
          <h2 className="text-xl font-semibold text-as-heading">MIT License</h2>
          <p className="text-sm leading-relaxed text-as-muted">
            The Arti application, smart contract helpers, and metadata schema are released under MIT.
            Fork it, adapt it, and ship your own immersive experiences with attribution.
          </p>
          <ul className="space-y-1 text-[0.65rem] uppercase tracking-[0.3em] text-as-muted">
            <li>- Commercial use permitted</li>
            <li>- Open to modification</li>
            <li>- Distribution encouraged</li>
            <li>- Private deployments supported</li>
          </ul>
        </article>

        <article className="pixel-card space-y-4 p-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-as-border px-4 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-as-muted">
            <Shield size={16} />
            Brand assets
          </div>
          <h2 className="text-xl font-semibold text-as-heading">Reserved rights</h2>
          <p className="text-sm leading-relaxed text-as-muted">
            Wordmarks, logotypes, and commissioned visuals remain proprietary. Reach out if you would
            like to collaborate on co-branded showcases or press materials.
          </p>
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-as-muted">
            Contact: brand@arti.gallery
          </p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="pixel-card space-y-4 p-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-as-border px-4 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-as-muted">
            <FileText size={16} />
            Metadata
          </div>
          <h2 className="text-xl font-semibold text-as-heading">CIP-721 extensions</h2>
          <p className="text-sm leading-relaxed text-as-muted">
            Our immersive metadata profile extends Cardano CIP-721 for motion, volumetric, and
            generative work. Use it freely and suggest amendments via GitHub issues.
          </p>
        </article>

        <article className="pixel-card space-y-4 p-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-as-border px-4 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-as-muted">
            <Scale size={16} />
            Compliance
          </div>
          <h2 className="text-xl font-semibold text-as-heading">Responsible usage</h2>
          <p className="text-sm leading-relaxed text-as-muted">
            By contributing to or deploying Arti, you agree to uphold respectful, inclusive practices
            and obey local regulations around digital asset issuance.
          </p>
        </article>
      </section>
    </div>
  )
}

export default Licensing
