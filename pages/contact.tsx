import { Mail, MessageCircle, Twitter, Github } from "lucide-react"

const Contact = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-8 pt-10 text-as-body">
      <section className="pixel-card px-8 py-12 text-center sm:px-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-as-border px-5 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-as-muted">
          Let's collaborate
        </span>
        <h1 className="mt-6 text-4xl font-semibold text-as-heading sm:text-5xl">
          Reach the Arti team.
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-as-muted">
          Curators, directors, collectors, and creative technologists are all part of the Arti
          ecosystem. Drop us a line and we will connect you with the right collaborator.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <article className="pixel-card flex flex-col gap-3 p-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-as-border px-4 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-as-muted">
            <Mail size={14} />
            Direct email
          </div>
          <p className="text-sm leading-relaxed text-as-muted">
            Partnerships, premieres, technical integrations, and press inquiries.
          </p>
          <a
            href="mailto:team@arti.gallery"
            className="text-sm font-semibold text-as-heading underline-offset-4 hover:underline"
          >
            team@arti.gallery
          </a>
        </article>

        <article className="pixel-card flex flex-col gap-3 p-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-as-border px-4 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-as-muted">
            <MessageCircle size={14} />
            Community
          </div>
          <p className="text-sm leading-relaxed text-as-muted">
            Join private listening sessions with artists and collectors. Request an invite to our
            Discord pilot and shape upcoming tooling.
          </p>
          <span className="text-sm font-semibold text-as-heading">Discord beta - request access</span>
        </article>

        <article className="pixel-card flex flex-col gap-3 p-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-as-border px-4 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-as-muted">
            <Twitter size={14} />
            Social updates
          </div>
          <p className="text-sm leading-relaxed text-as-muted">
            Follow release announcements, collector spotlights, and behind-the-scenes production
            notes.
          </p>
          <span className="text-sm font-semibold text-as-heading">@arti_gallery</span>
        </article>

        <article className="pixel-card flex flex-col gap-3 p-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-as-border px-4 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-as-muted">
            <Github size={14} />
            Build with us
          </div>
          <p className="text-sm leading-relaxed text-as-muted">
            Explore our open metadata schema, suggest viewers, or contribute integrations via GitHub.
          </p>
          <a
            href="https://github.com/artigallery"
            className="text-sm font-semibold text-as-heading underline-offset-4 hover:underline"
          >
            github.com/artigallery
          </a>
        </article>
      </section>
    </div>
  )
}

export default Contact
