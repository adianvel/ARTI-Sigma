import Link from "next/link"
import { RefreshCw, Home, MailWarning } from "lucide-react"

const ServerError = () => {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 text-as-body">
      <div className="max-w-2xl space-y-8 text-center">
        <section className="pixel-card px-8 py-12">
          <h1 className="text-5xl font-semibold text-as-heading">500</h1>
          <p className="mt-4 text-lg leading-relaxed text-as-muted">
            The atelier is momentarily unavailable. We have logged the error and will resolve it
            shortly.
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="pixel-card p-6 text-sm leading-relaxed"
          >
            <RefreshCw className="mx-auto mb-3 text-as-heading" size={20} />
            <p className="font-semibold text-as-heading">Reload</p>
            <p className="mt-2 text-as-muted">Try the request again</p>
          </button>

          <Link href="/" className="pixel-card p-6 text-sm leading-relaxed">
            <Home className="mx-auto mb-3 text-as-heading" size={20} />
            <p className="font-semibold text-as-heading">Return home</p>
            <p className="mt-2 text-as-muted">Back to the gallery</p>
          </Link>

          <a
            href="mailto:support@artisigma.com"
            className="pixel-card p-6 text-sm leading-relaxed"
          >
            <MailWarning className="mx-auto mb-3 text-as-heading" size={20} />
            <p className="font-semibold text-as-heading">Report issue</p>
            <p className="mt-2 text-as-muted">support@artisigma.com</p>
          </a>
        </div>
      </div>
    </div>
  )
}

export default ServerError
