import { utf8ToHex } from "lucid-cardano"
import { useCallback, useMemo, useState } from "react"
import { useCardano, utility } from "use-cardano"

export default function Sign() {
  const {
    lucid,
    isValid,
    showToaster,
    hideToaster,
    account: { address },
  } = useCardano()

  const [message, setMessage] = useState<string>()
  const [isSigning, setIsSigning] = useState(false)

  const signMessage = useCallback(async () => {
    if (!lucid || !address || !message) return

    setIsSigning(true)

    try {
      const payload = utf8ToHex(message)

      const signedMessage = await lucid.newMessage(address, payload).sign()
      const hasSigned: boolean = lucid.verifyMessage(address, payload, signedMessage)

      if (!hasSigned) throw new Error("Could not sign message")

      showToaster("Signed message", message)
      setMessage(undefined)
    } catch (e) {
      if (utility.isError(e)) showToaster("Could not sign message", e.message)
      else if (typeof e === "string") showToaster("Could not sign message", e)
    } finally {
      setIsSigning(false)
    }
  }, [lucid, address, message, showToaster])

  const canSign = useMemo(() => isValid && !isSigning && !!message, [isValid, isSigning, message])

  return (
    <div className="mx-auto max-w-4xl space-y-8 pt-10 text-as-body">
      <section className="pixel-card px-8 py-12 text-center">
        <span className="inline-flex items-center justify-center rounded-full border border-as-border px-4 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-as-muted">
          Signature console
        </span>
        <h1 className="mt-6 text-3xl font-semibold text-as-heading sm:text-4xl">Sign a message</h1>
        <p className="mt-4 text-lg leading-relaxed text-as-muted">
          Use Lucid to produce a verifiable signature from your Cardano wallet. Perfect for
          authenticity receipts or gallery approvals.
        </p>
      </section>

      <section className="pixel-card space-y-6 px-8 py-10">
        <div className="space-y-3 text-left">
          <label className="text-sm font-semibold uppercase tracking-[0.35em] text-as-muted" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            className="pixel-input min-h-[140px]"
            placeholder="Hello from Arti"
            value={message ?? ""}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>
        <div className="text-center">
          <button
            type="button"
            disabled={!canSign}
            onClick={() => {
              if (!canSign) return
              hideToaster()
              signMessage()
            }}
            className="pixel-btn pixel-btn--primary inline-flex items-center justify-center px-8 py-3 text-[0.65rem] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigning ? "Signing..." : "Sign message"}
          </button>
          <p className="mt-3 text-sm text-as-muted">
            {isValid === false
              ? "A connected wallet is required."
              : isSigning
              ? "Awaiting wallet signature..."
              : message
              ? "Ready when you are."
              : "Enter a message to sign."}
          </p>
        </div>
      </section>
    </div>
  )
}
