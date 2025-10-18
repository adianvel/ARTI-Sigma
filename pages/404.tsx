import Link from "next/link"
import { Sparkles, Compass, ArrowLeft } from "lucide-react"

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 text-as-body">
      <div className="max-w-2xl space-y-8 text-center">
        <section className="pixel-card px-8 py-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-as-border px-4 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-as-muted">
            Lost in the archive
          </span>
          <h1 className="mt-6 text-5xl font-semibold text-as-heading">404</h1>
          <p className="mt-4 text-lg leading-relaxed text-as-muted">
            This certificate or page does not exist. Retrace your path or explore the studio.
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/" className="pixel-card group p-6 text-sm leading-relaxed">
            <Sparkles className="mx-auto mb-3 text-as-heading" size={20} />
            <p className="font-semibold text-as-heading">Back to gallery</p>
            <p className="mt-2 text-as-muted">View curated certificates</p>
          </Link>

          <Link href="/app" className="pixel-card group p-6 text-sm leading-relaxed">
            <Compass className="mx-auto mb-3 text-as-heading" size={20} />
            <p className="font-semibold text-as-heading">Open studio</p>
            <p className="mt-2 text-as-muted">Mint or manage assets</p>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="pixel-card group p-6 text-sm leading-relaxed"
            type="button"
          >
            <ArrowLeft className="mx-auto mb-3 text-as-heading" size={20} />
            <p className="font-semibold text-as-heading">Go back</p>
            <p className="mt-2 text-as-muted">Return to previous view</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
