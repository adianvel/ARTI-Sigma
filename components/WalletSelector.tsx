import { useEffect, useState } from "react"
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
          : `Could not connect with ${walletId}. Please ensure the wallet is installed and set to the Pre-Production network.`
      )
      setStatus(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {WALLET_OPTIONS.map((wallet) => (
          <button
            key={wallet.id}
            disabled={!isReady || Boolean(initializationError)}
            className="pixel-card w-full bg-pl-card p-4 text-left transition duration-120 hover:-translate-y-1 hover:shadow-pixel disabled:pointer-events-none disabled:opacity-50"
            onClick={() => handleConnect(wallet.id)}
          >
            <div className="font-display text-lg tracking-[0.15em] text-pl-heading">{wallet.label}</div>
            <div className="mt-1 text-sm uppercase tracking-[0.25em] text-pl-muted">Cardano wallet</div>
          </button>
        ))}
      </div>

      {status && <p className="text-sm text-pl-primary">{status}</p>}
      {error && <p className="text-sm text-[color:var(--color-danger)]">{error}</p>}

      <p className="text-sm leading-relaxed text-pl-muted">
        Tip: Ensure your wallet is switched to the Cardano Pre-Production testnet before connecting.
      </p>
    </div>
  )
}


