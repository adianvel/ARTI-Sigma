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
    <div className="mx-auto max-w-4xl space-y-8 pt-8">
      {/* Header Section */}
      <section className="rounded-[40px] bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 px-6 py-12 shadow-[0_28px_80px_rgba(139,92,246,0.25)] ring-1 ring-violet-100 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-violet-600 ring-1 ring-violet-200 mb-6">
          ✍️ Digital Signature
        </span>
        <h1 className="text-4xl font-semibold text-pl-heading sm:text-5xl mb-6">Sign a Message</h1>
        <p className="text-lg leading-relaxed text-pl-body opacity-80 max-w-3xl mx-auto">
          Using Lucid, sign a message on Cardano and keep the signature as proof of ownership and authenticity.
        </p>
      </section>

      {/* Signing Form */}
      <div className="rounded-[32px] bg-white/80 px-8 py-10 shadow-[0_24px_60px_rgba(212,177,189,0.25)] ring-1 ring-rose-100 space-y-8">
        <div className="space-y-4">
          <label className="flex flex-col gap-3">
            <span className="text-base font-semibold text-pl-heading">Message to Sign</span>
            <input
              className="rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 py-4 text-base text-pl-body placeholder-gray-400 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100 transition-all"
              name="message"
              placeholder="Hello, Cardano! 🐕"
              value={message || ""}
              onChange={(e) => setMessage(e.target.value?.toString())}
            />
          </label>
        </div>

        <div className="space-y-4 text-center">
          <button
            disabled={!canSign}
            className={`group relative inline-flex items-center gap-3 rounded-full p-1 shadow-lg transition-all duration-300 hover:-translate-y-1 ${
              canSign 
                ? 'bg-gradient-to-r from-violet-400 via-purple-500 to-fuchsia-600 shadow-[0_20px_60px_rgba(139,92,246,0.4)] hover:shadow-[0_30px_80px_rgba(139,92,246,0.6)]' 
                : 'bg-gray-300 shadow-gray-200 cursor-not-allowed'
            }`}
            onClick={() => {
              if (canSign) {
                hideToaster()
                signMessage()
              }
            }}
          >
            <div className={`rounded-full px-8 py-4 text-base font-bold uppercase tracking-[0.2em] transition-colors ${
              canSign 
                ? 'bg-white text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-700 bg-clip-text' 
                : 'bg-gray-100 text-gray-400'
            }`}>
              {isSigning ? 'Signing...' : 'Sign Message'}
            </div>
          </button>

          <div className="text-sm text-pl-body opacity-70">
            {isValid === false ? (
              <p className="flex items-center justify-center gap-2">
                🔗 Connect a wallet to sign a message
              </p>
            ) : isSigning ? (
              <p className="flex items-center justify-center gap-2">
                ⏳ Signing message with your wallet...
              </p>
            ) : message ? (
              <p className="flex items-center justify-center gap-2">
                ✅ Ready to sign
              </p>
            ) : (
              <p className="flex items-center justify-center gap-2">
                📝 Enter a message to sign
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[24px] bg-gradient-to-br from-blue-50 to-cyan-100 px-6 py-6 shadow-[0_12px_24px_rgba(59,130,246,0.15)] ring-1 ring-blue-100">
          <h3 className="font-semibold text-pl-heading mb-2">🔐 Why Sign Messages?</h3>
          <p className="text-sm text-pl-body opacity-80">
            Message signing proves ownership of your wallet without revealing private keys. It's a secure way to authenticate your identity.
          </p>
        </div>

        <div className="rounded-[24px] bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-6 shadow-[0_12px_24px_rgba(34,197,94,0.15)] ring-1 ring-green-100">
          <h3 className="font-semibold text-pl-heading mb-2">⚡ Powered by Lucid</h3>
          <p className="text-sm text-pl-body opacity-80">
            Using Lucid library for seamless Cardano wallet integration and secure message signing protocols.
          </p>
        </div>
      </div>
    </div>
  )
}


