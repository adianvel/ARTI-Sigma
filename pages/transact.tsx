import { useEffect } from "react"
import { useTransaction } from "hooks/use-transaction"
import { useCardano } from "use-cardano"

export default function Transact() {
  const { isValid, hideToaster, showToaster } = useCardano()
  const tx = useTransaction()

  useEffect(() => {
    if (!tx.successMessage) {
      hideToaster()
    } else {
      showToaster("Success", tx.successMessage)
    }
  }, [tx.successMessage, hideToaster, showToaster])

  return (
    <div className="mx-auto max-w-4xl space-y-8 pt-10 text-as-body">
      <section className="pixel-card px-8 py-12 text-center">
        <span className="inline-flex items-center justify-center rounded-full border border-as-border px-4 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-as-muted">
          Transaction console
        </span>
        <h1 className="mt-6 text-3xl font-semibold text-as-heading sm:text-4xl">
          Send a transaction
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-as-muted">
          Transfer ADA with Lucid. Useful for issuing reimbursements or settling gallery consignments
          associated with certificates.
        </p>
      </section>

      <section className="pixel-card space-y-6 px-8 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.35em] text-as-muted">
              Recipient address
            </span>
            <input
              className="pixel-input font-mono text-sm"
              type="text"
              placeholder="addr1..."
              value={tx.toAccount}
              onChange={(event) => tx.setToAccount(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.35em] text-as-muted">
              Amount (lovelace)
            </span>
            <input
              className="pixel-input"
              type="number"
              min="0"
              step="1000000"
              value={tx.lovelace}
              onChange={(event) => tx.setLovelace(event.target.value)}
            />
            <span className="text-[0.6rem] uppercase tracking-[0.35em] text-as-muted">
              1 ADA = 1,000,000 lovelace
            </span>
          </label>
        </div>

        <div className="text-center">
          <button
            type="button"
            disabled={!tx.canTransact || !!tx.error}
            onClick={tx.sendTransaction}
            className="pixel-btn pixel-btn--primary inline-flex items-center justify-center px-8 py-3 text-[0.65rem] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isValid === false ? "Connect wallet" : tx.error ? "Resolve error" : "Send transaction"}
          </button>
          <p className="mt-3 text-sm text-as-muted">
            {isValid === false
              ? "A connected wallet is required."
              : tx.error
              ? tx.error.message
              : tx.successMessage
              ? "Transaction submitted successfully."
              : "Specify an address and amount to continue."}
          </p>
        </div>
      </section>
    </div>
  )
}
