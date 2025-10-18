import { useEffect, useState } from "react"
import { Wallet, Check, AlertCircle, Info } from "lucide-react"
import { useLucid } from "../contexts/LucidContext"

const WALLET_OPTIONS = [
  { id: "nami", label: "Nami" },
  { id: "eternl", label: "Eternl" },
  { id: "gerowallet", label: "GeroWallet" },
  { id: "flint", label: "Flint" },
]

interface WalletSelectorProps {
  onConnect?: () => void
}

export const WalletSelector = ({ onConnect }: WalletSelectorProps) => {
  const { connect, initializationError, isReady } = useLucid()
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initializationError) {
      setError(initializationError)
      setStatus(null)
    }
  }, [initializationError])

  const handleConnect = async (walletId: string) => {
    setStatus(`Connecting to ${walletId}...`)
    setError(null)
    try {
      await connect(walletId)
      setStatus(`Connected with ${walletId}`)
      if (onConnect) onConnect()
    } catch (err) {
      console.error(`Failed to connect ${walletId}`, err)
      setError(
        err instanceof Error
          ? err.message
          : `Could not connect with ${walletId}. Ensure the wallet is installed and pointed at the Pre-Production network.`
      )
      setStatus(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3">
        {WALLET_OPTIONS.map((wallet) => (
          <button
            key={wallet.id}
            disabled={!isReady || Boolean(initializationError)}
            className="group flex w-full items-center justify-between rounded-[18px] border border-as-border bg-as-background/80 px-4 py-4 text-left transition-all duration-200 hover:border-as-borderStrong/50 hover:bg-as-highlight/30 disabled:pointer-events-none disabled:opacity-40"
            onClick={() => handleConnect(wallet.id)}
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full border border-as-border bg-as-highlight/20 p-3 text-as-muted">
                <Wallet size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-as-heading">
                  {wallet.label}
                </p>
                <p className="text-[0.6rem] uppercase tracking-[0.3em] text-as-muted">
                  Cardano wallet
                </p>
              </div>
            </div>
            <div className="text-[0.6rem] uppercase tracking-[0.3em] text-as-muted group-hover:text-as-heading">
              Engage
            </div>
          </button>
        ))}
      </div>

      {status && (
        <div className="flex items-center gap-2 rounded-[18px] border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200">
          <Check size={16} /> {status}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-[18px] border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="flex items-start gap-3 rounded-[18px] border border-as-border bg-as-highlight/20 px-4 py-3 text-[0.75rem] leading-relaxed text-as-muted">
        <Info size={16} className="mt-0.5 text-as-heading" />
        <span>
          Tip: set your wallet to the Cardano Pre-Production testnet before connecting to ensure a
          smooth minting flow.
        </span>
      </div>
    </div>
  )
}
