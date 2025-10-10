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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {WALLET_OPTIONS.map((wallet) => (
          <button
            key={wallet.id}
            disabled={!isReady || Boolean(initializationError)}
            className="group w-full rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 text-left ring-1 ring-blue-100 transition-all duration-300 hover:shadow-[0_12px_24px_rgba(59,130,246,0.15)] hover:-translate-y-1 hover:ring-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:grayscale"
            onClick={() => handleConnect(wallet.id)}
          >
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-200 group-hover:shadow-md transition-shadow">
                <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-pl-heading">{wallet.label}</div>
                <div className="mt-1 text-sm text-blue-600 font-medium">Cardano Wallet</div>
              </div>
              <div className="text-blue-400 group-hover:text-blue-600 transition-colors">
                →
              </div>
            </div>
          </button>
        ))}
      </div>

      {status && (
        <div className="rounded-2xl bg-green-50 px-4 py-3 ring-1 ring-green-200">
          <p className="text-sm font-medium text-green-700 flex items-center gap-2">
            <span>✅</span> {status}
          </p>
        </div>
      )}
      
      {error && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 ring-1 ring-red-200">
          <p className="text-sm font-medium text-red-700 flex items-center gap-2">
            <span>⚠️</span> {error}
          </p>
        </div>
      )}

      <div className="rounded-2xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
        <p className="text-sm text-amber-700 flex items-center gap-2">
          <span>💡</span>
          <span><strong>Tip:</strong> Ensure your wallet is switched to the Cardano Pre-Production testnet before connecting.</span>
        </p>
      </div>
    </div>
  )
}


