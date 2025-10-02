import { useState } from "react"
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
  const { connect } = useLucid()
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3 text-left transition hover:border-blue-500 hover:shadow"
            onClick={() => handleConnect(wallet.id)}
          >
            <div className="font-semibold text-slate-900 dark:text-slate-50">{wallet.label}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Cardano wallet</div>
          </button>
        ))}
      </div>

      {status && <p className="text-sm text-blue-600 dark:text-blue-400">{status}</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Tip: Ensure your wallet is switched to the Cardano Pre-Production testnet before connecting.
      </p>
    </div>
  )
}
