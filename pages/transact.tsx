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
    <div className="mx-auto max-w-3xl space-y-8 text-pl-body">
      <header className="space-y-2 text-center">
        <h1 className="font-display text-4xl tracking-[0.25em] text-pl-heading">Transact</h1>
        <p className="text-lg leading-relaxed text-pl-muted">
          Using Lucid, you can send transactions directly on the Cardano blockchain.
        </p>
      </header>

      <div className="pixel-card space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-sm uppercase tracking-[0.25em] text-pl-muted">To account</span>
            <input
              className="pixel-input text-base"
              type="text"
              placeholder="addr..."
              value={tx.toAccount}
              onChange={(e) => tx.setToAccount(e.target.value?.toString())}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-sm uppercase tracking-[0.25em] text-pl-muted">Lovelace</span>
            <input
              className="pixel-input text-base"
              type="number"
              min="0"
              step="1000"
              name="amount"
              value={tx.lovelace}
              onChange={(e) => tx.setLovelace(e.target.value?.toString())}
            />
          </label>
        </div>

        <div className="space-y-3 text-center">
          <button
            className="pixel-btn pixel-btn--primary w-full px-6 py-3 text-base uppercase tracking-[0.3em] sm:w-auto"
            disabled={!tx.canTransact || !!tx.error}
            onClick={tx.sendTransaction}
          >
            Send transaction
          </button>

          <div className="text-xs italic text-pl-muted">
            {isValid === false ? (
              <p>Connect a wallet to send a transaction.</p>
            ) : !tx.successMessage && !tx.error && !tx.canTransact ? (
              <p>Specify a lovelace amount and account to send a transaction.</p>
            ) : tx.error ? (
              <p className="text-[color:var(--color-danger)]">{tx.error.message}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}



