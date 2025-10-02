import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo } from "react"

const explorerBase = process.env.NEXT_PUBLIC_EXPLORER_URL ?? "https://preprod.cexplorer.io/tx/"

export default function MintSuccess() {
  const { query } = useRouter()
  const txHash = typeof query.tx === "string" ? query.tx : ""
  const assetUnit = typeof query.asset === "string" ? query.asset : ""

  const explorerUrl = useMemo(() => {
    if (!txHash) return null
    return `${explorerBase}${txHash}`
  }, [txHash])

  return (
    <section className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-green-200 bg-green-50 p-6 text-green-900 shadow-sm dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-200">
      <h1 className="text-2xl font-semibold">Passport minted successfully!</h1>
      <p className="text-sm">
        Your transaction has been submitted to the Cardano Pre-Production testnet. It may take a minute for the
        asset to appear in your wallet and the passport gallery.
      </p>

      {assetUnit && (
        <div className="rounded border border-green-200 bg-white/70 p-4 text-xs text-green-700 dark:border-green-900/30 dark:bg-transparent dark:text-green-200">
          <p className="font-medium">Asset Unit</p>
          <p className="break-all font-mono text-[11px]">{assetUnit}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/my-passports"
          className="inline-flex items-center rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-green-500"
        >
          View My Passports
        </Link>
        {explorerUrl && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-green-400 px-5 py-2 text-sm font-semibold text-green-700 transition hover:border-green-500 hover:text-green-900 dark:text-green-200"
          >
            View on Explorer
          </a>
        )}
      </div>
    </section>
  )
}
