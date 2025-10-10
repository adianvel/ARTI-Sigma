import { useEffect } from "react"
import { useTransaction } from "hooks/use-transaction"
import { useCardano } from "use-cardano"

export default function Transact() {
  const { isValid, hideToaster, showToaster } = useCardano()
  const tx = useTransaction()

  useEffect(() => {
    if (!tx.successMessage) {
      hideToaster
    } else {
      showToaster("Success!", tx.successMessage)
    }
  }, [tx.successMessage, hideToaster, showToaster])

  return (
    <div className="mx-auto max-w-4xl space-y-8 pt-8">
      {/* Header Section */}
      <section className="rounded-[40px] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-6 py-12 shadow-[0_28px_80px_rgba(16,185,129,0.25)] ring-1 ring-emerald-100 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600 ring-1 ring-emerald-200 mb-6">
          ⚡ Blockchain
        </span>
        <h1 className="text-4xl font-semibold text-pl-heading sm:text-5xl mb-6">Send Transaction</h1>
        <p className="text-lg leading-relaxed text-pl-body opacity-80 max-w-3xl mx-auto">
          Using Lucid, you can send transactions directly on the Cardano blockchain. 
          Transfer ADA securely and transparently.
        </p>
      </section>

      {/* Transaction Form */}
      <div className="rounded-[32px] bg-white/80 px-8 py-10 shadow-[0_24px_60px_rgba(212,177,189,0.25)] ring-1 ring-rose-100 space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <label className="flex flex-col gap-3">
              <span className="text-base font-semibold text-pl-heading">Recipient Address</span>
              <input
                className="rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 py-4 text-base text-pl-body placeholder-gray-400 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all font-mono text-sm"
                type="text"
                placeholder="addr1qy..."
                value={tx.toAccount}
                onChange={(e) => tx.setToAccount(e.target.value?.toString())}
              />
            </label>
          </div>

          <div className="space-y-3">
            <label className="flex flex-col gap-3">
              <span className="text-base font-semibold text-pl-heading">Amount (Lovelace)</span>
              <input
                className="rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 py-4 text-base text-pl-body placeholder-gray-400 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                type="number"
                min="0"
                step="1000000"
                name="amount"
                placeholder="1000000"
                value={tx.lovelace}
                onChange={(e) => tx.setLovelace(e.target.value?.toString())}
              />
              <p className="text-xs text-pl-body opacity-60">
                1 ADA = 1,000,000 Lovelace
              </p>
            </label>
          </div>
        </div>

        <div className="space-y-4 text-center">
          <button
            className={`group relative inline-flex items-center gap-3 rounded-full p-1 shadow-lg transition-all duration-300 hover:-translate-y-1 ${
              tx.canTransact && !tx.error
                ? 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 shadow-[0_20px_60px_rgba(16,185,129,0.4)] hover:shadow-[0_30px_80px_rgba(16,185,129,0.6)]' 
                : 'bg-gray-300 shadow-gray-200 cursor-not-allowed'
            }`}
            disabled={!tx.canTransact || !!tx.error}
            onClick={tx.sendTransaction}
          >
            <div className={`rounded-full px-8 py-4 text-base font-bold uppercase tracking-[0.2em] transition-colors ${
              tx.canTransact && !tx.error
                ? 'bg-white text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 bg-clip-text' 
                : 'bg-gray-100 text-gray-400'
            }`}>
              Send Transaction
            </div>
          </button>

          <div className="text-sm text-pl-body opacity-70">
            {isValid === false ? (
              <p className="flex items-center justify-center gap-2">
                🔗 Connect a wallet to send a transaction
              </p>
            ) : !tx.successMessage && !tx.error && !tx.canTransact ? (
              <p className="flex items-center justify-center gap-2">
                📝 Specify a lovelace amount and account to send a transaction
              </p>
            ) : tx.error ? (
              <p className="flex items-center justify-center gap-2 text-red-600">
                ⚠️ {tx.error.message}
              </p>
            ) : tx.successMessage ? (
              <p className="flex items-center justify-center gap-2 text-green-600">
                ✅ Transaction sent successfully!
              </p>
            ) : (
              <p className="flex items-center justify-center gap-2">
                ⚡ Ready to send
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[24px] bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-6 shadow-[0_12px_24px_rgba(59,130,246,0.15)] ring-1 ring-blue-100">
          <h3 className="font-semibold text-pl-heading mb-2">🔐 Secure Transactions</h3>
          <p className="text-sm text-pl-body opacity-80">
            All transactions are signed with your wallet's private key and broadcast to the Cardano network for verification.
          </p>
        </div>

        <div className="rounded-[24px] bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-6 shadow-[0_12px_24px_rgba(34,197,94,0.15)] ring-1 ring-green-100">
          <h3 className="font-semibold text-pl-heading mb-2">⚡ Network Fees</h3>
          <p className="text-sm text-pl-body opacity-80">
            Network transaction fees are automatically calculated and added to your transaction amount.
          </p>
        </div>
      </div>
    </div>
  )
}



