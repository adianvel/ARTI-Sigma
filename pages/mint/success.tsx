import Link from "next/link"
import { PawPrint, CheckCircle, ExternalLink } from "lucide-react"
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
    ? `${petName}'s digital passport is now officially on the blockchain!`
    : "Digital passport is now officially on the blockchain!"

  return (
    <div className="mx-auto max-w-4xl space-y-8 pt-8">
      {/* Success Banner */}
      <section className="rounded-[40px] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-6 py-12 shadow-[0_28px_80px_rgba(34,197,94,0.25)] ring-1 ring-green-200 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
        </div>
        
        <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-green-700 ring-1 ring-green-200 mb-4">
          <PawPrint size={16} />
          Mint Complete
        </span>
        
        <h1 className="text-4xl font-semibold text-pl-heading mb-4 sm:text-5xl">
          Congratulations! 🎉
        </h1>
        
        <p className="text-xl leading-relaxed text-pl-body opacity-80 max-w-2xl mx-auto">
          {successMessage}
        </p>
      </section>

      {/* Transaction Details */}
      <section className="rounded-[32px] bg-white/80 px-6 py-8 shadow-[0_24px_60px_rgba(212,177,189,0.25)] ring-1 ring-rose-100">
        <h2 className="text-2xl font-semibold text-pl-heading mb-6">Transaction Details</h2>
        
        <div className="space-y-6">
          <p className="text-lg leading-relaxed text-pl-body opacity-80">
            Your transaction has been submitted to the Cardano Pre-Production testnet. It may take a minute for the
            asset to appear in your wallet and the passport gallery.
          </p>

          {assetUnit && (
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700 mb-3">Asset Unit ID</h3>
              <div className="rounded-lg bg-white/70 p-4">
                <p className="break-all font-mono text-sm text-blue-800 leading-relaxed">{assetUnit}</p>
              </div>
            </div>
          )}

          {txHash && (
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-700 mb-3">Transaction Hash</h3>
              <div className="rounded-lg bg-white/70 p-4">
                <p className="break-all font-mono text-sm text-purple-800 leading-relaxed">{txHash}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Action Buttons */}
      <section className="rounded-[32px] bg-gradient-to-r from-rose-200/60 via-white/80 to-sky-200/60 px-6 py-8 shadow-[0_20px_60px_rgba(244,175,208,0.28)] ring-1 ring-rose-100">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold text-pl-heading">What's Next?</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/my-passports"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300 px-8 py-3 text-base font-semibold text-white shadow-[0_20px_50px_rgba(244,175,208,0.45)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(244,175,208,0.55)]"
            >
              <PawPrint size={18} />
              View My Pet Collection
            </Link>
            
            {explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/80 px-8 py-3 text-base font-semibold text-pl-heading ring-1 ring-rose-200 shadow-[0_14px_32px_rgba(255,255,255,0.35)] transition duration-200 hover:-translate-y-0.5 hover:bg-white/90"
              >
                <ExternalLink size={18} />
                View on Blockchain Explorer
              </a>
            )}
          </div>
          
          <p className="text-sm text-pl-body opacity-70 max-w-md mx-auto">
            Your pet's digital identity is now secured on the blockchain forever. Share it with pride!
          </p>
        </div>
      </section>
    </div>
  )
}


