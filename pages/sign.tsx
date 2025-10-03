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
    <div className="mx-auto max-w-3xl space-y-8 text-pl-body">
      <header className="space-y-2 text-center">
        <h1 className="font-display text-4xl tracking-[0.25em] text-pl-heading">Sign a Message</h1>
        <p className="text-lg leading-relaxed text-pl-muted">
          Using Lucid, sign a message on Cardano and keep the signature as proof.
        </p>
      </header>

      <div className="pixel-card space-y-6 p-6">
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-sm uppercase tracking-[0.25em] text-pl-muted">Message</span>
          <input
            className="pixel-input text-base"
            name="message"
            placeholder="Hello, Cardano!"
            value={message || ""}
            onChange={(e) => setMessage(e.target.value?.toString())}
          />
        </label>

        <div className="space-y-3 text-center">
          <button
            disabled={!canSign}
            className="pixel-btn pixel-btn--primary w-full px-6 py-3 text-base uppercase tracking-[0.3em] sm:w-auto"
            onClick={() => {
              hideToaster()
              signMessage()
            }}
          >
            Sign message
          </button>

          <div className="text-xs italic text-pl-muted">
            {isValid === false ? (
              <p>Connect a wallet to sign a message.</p>
            ) : isSigning ? (
              <p>Signing…</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}


