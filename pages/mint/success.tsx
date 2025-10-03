import Link from "next/link"
import { PawPrint } from "lucide-react"
import { useRouter } from "next/router"
import { useMemo } from "react"

const explorerBase = process.env.NEXT_PUBLIC_EXPLORER_URL ?? "https://preprod.cexplorer.io/tx/"

export default function MintSuccess() {
  const { query } = useRouter()
  const txHash = typeof query.tx === "string" ? query.tx : ""
  const assetUnit = typeof query.asset === "string" ? query.asset : ""
  const petName = typeof query.pet === "string" ? query.pet : ""

  const explorerUrl = useMemo(() => {
    if (!txHash) return null
    return `${explorerBase}${txHash}`
  }, [txHash])

  const successMessage = petName
    ? `Success! ${petName}'s Paw-ssport is now officially on the blockchain!`
    : "Success! Paw-ssport is now officially on the blockchain!"

  return (
    <section className="mx-auto max-w-2xl space-y-6 text-pl-body">
      <div className="pixel-toast pixel-toast--success flex items-center gap-4 p-4">
        <span className="pixel-badge" aria-hidden>
          <PawPrint size={20} />
        </span>
        <div className="space-y-1 text-left">
          <p className="font-display text-base uppercase tracking-[0.3em]">Mint complete</p>
          <p className="text-base leading-relaxed text-pl-body">{successMessage}</p>
        </div>
      </div>

      <div className="pixel-card space-y-4 p-6">
        <h1 className="font-display text-2xl tracking-[0.2em] text-pl-heading">Passport minted successfully!</h1>
        <p className="text-base leading-relaxed text-pl-body">
          Your transaction has been submitted to the Cardano Pre-Production testnet. It may take a minute for the
          asset to appear in your wallet and the passport gallery.
        </p>

        {assetUnit && (
          <div className="pixel-banner p-4 text-base text-pl-heading">
            <p className="font-display text-sm uppercase tracking-[0.3em]">Asset unit</p>
            <p className="mt-2 break-all font-mono text-pl-body">{assetUnit}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Link
            href="/my-passports"
            className="pixel-btn pixel-btn--primary px-5 py-2 text-base uppercase tracking-[0.3em]"
          >
            View my passports
          </Link>
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-btn px-5 py-2 text-base uppercase tracking-[0.3em]"
            >
              View on explorer
            </a>
          )}
        </div>
      </div>
    </section>
  )
}


