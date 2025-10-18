import Link from "next/link"
import { CheckCircle2, ExternalLink } from "lucide-react"
import { useRouter } from "next/router"
import { useMemo } from "react"

const explorerBase = process.env.NEXT_PUBLIC_EXPLORER_URL ?? "https://preprod.cexplorer.io/tx/"

export default function MintSuccess() {
  const { query } = useRouter()
  const txHash = typeof query.tx === "string" ? query.tx : ""
  const assetUnit = typeof query.asset === "string" ? query.asset : ""
  const title = typeof query.title === "string" ? query.title : ""
  const medium = typeof query.medium === "string" ? query.medium : ""

  const explorerUrl = useMemo(() => {
    if (!txHash) return null
    return `${explorerBase}${txHash}`
  }, [txHash])

  return (
    <div className="mx-auto max-w-4xl space-y-8 pt-10 text-as-body">
      <section className="pixel-card px-8 py-14 text-center sm:px-12">
        <div className="flex justify-center">
          <div className="rounded-full border border-as-border bg-as-highlight/30 p-6 text-as-heading">
            <CheckCircle2 size={48} />
          </div>
        </div>
        <h1 className="mt-6 text-4xl font-semibold text-as-heading sm:text-5xl">
          Art piece minted successfully.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-as-muted">
          {title
            ? `"${title}" is now sealed on Cardano as part of the Arti registry${
                medium ? ` - catalogued under ${medium}.` : "."
              }`
            : "Your artwork is now sealed on Cardano as part of the Arti registry."}
        </p>
      </section>

      <section className="rounded-[26px] border border-as-border bg-as-surface/80 px-6 py-8 sm:px-10">
        <h2 className="text-2xl font-semibold text-as-heading">Transaction details</h2>
        <p className="mt-3 text-sm text-as-muted">
          It may take a moment for the token to appear in wallets and the public gallery. Share the
          identifiers below with collectors for provenance verification.
        </p>

        {assetUnit && (
          <div className="mt-6 rounded-[18px] border border-as-border bg-as-highlight/20 p-5">
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-as-muted/70">Asset unit</p>
            <p className="mt-2 break-all font-mono text-[0.7rem] uppercase tracking-[0.25em] text-as-heading">
              {assetUnit}
            </p>
          </div>
        )}

        {txHash && (
          <div className="mt-6 rounded-[18px] border border-as-border bg-as-highlight/20 p-5">
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-as-muted/70">
              Transaction hash
            </p>
            <p className="mt-2 break-all font-mono text-[0.7rem] uppercase tracking-[0.25em] text-as-heading">
              {txHash}
            </p>
          </div>
        )}
      </section>

      <section className="rounded-[26px] border border-as-border bg-as-surface/80 px-6 py-8 text-center sm:px-10">
        <h2 className="text-2xl font-semibold text-as-heading">Next steps</h2>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/my-passports"
            className="pixel-btn pixel-btn--primary inline-flex items-center justify-center px-8 py-3 text-[0.65rem]"
          >
            Go to my collection
          </Link>
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-btn inline-flex items-center justify-center gap-2 px-8 py-3 text-[0.65rem]"
            >
              <ExternalLink size={16} aria-hidden />
              View on explorer
            </a>
          )}
        </div>
        <p className="mt-4 text-sm text-as-muted">
          Share the explorer link with collaborators or collectors so they can verify the mint.
        </p>
      </section>
    </div>
  )
}
