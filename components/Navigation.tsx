import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { Cat, PawPrint, Home } from "lucide-react"
import { Modal } from "./Modal"
import { WalletSelector } from "./WalletSelector"
import { useLucid } from "../contexts/LucidContext"

const navLinkClass = (active: boolean) =>
  [
    "inline-flex items-center gap-2 rounded-pixel px-3 py-2 text-base sm:text-lg font-medium tracking-wide transition duration-120",
    active
      ? "bg-pl-highlight text-pl-heading shadow-pixel-sm"
      : "text-pl-muted hover:bg-pl-highlight hover:text-pl-heading",
  ].join(" ")

const MarketingNavigation = () => {
  return (
    <header className="flex items-center justify-center py-8">
      <span className="rounded-full bg-white/80 px-6 py-3 font-display text-xl uppercase tracking-[0.35em] text-pl-heading shadow-[0_18px_36px_rgba(244,175,208,0.35)] ring-1 ring-rose-100 backdrop-blur">
        PetLog
      </span>
    </header>
  )
}

const AppNavigation = ({ currentPath }: { currentPath: string }) => {
  const { account, disconnect, isReady, network, initializationError } = useLucid()
  const [isWalletModalOpen, setWalletModalOpen] = useState(false)

  const links = useMemo(
    () => [
      { href: "/app", label: "Home", icon: Home },
      { href: "/my-passports", label: "My Cat Crew", icon: Cat },
    ],
    []
  )

  const handleDisconnect = () => {
    disconnect()
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-pl-border pb-5 pt-8">
      <Link href="/" className="font-display text-2xl uppercase tracking-[0.3em] text-pl-heading">
        PetLog
      </Link>

      <nav className="flex items-center gap-2 sm:gap-3">
        {links.map((link) => {
          const ActiveIcon = link.icon
          const isActive = currentPath === link.href
          return (
            <Link key={link.href} href={link.href} className={navLinkClass(isActive)}>
              {ActiveIcon ? <ActiveIcon size={16} aria-hidden /> : null}
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-3">
        <span className="hidden text-base uppercase tracking-[0.2em] text-pl-muted md:inline">
          Network: {network}
        </span>
        {account ? (
          <button onClick={handleDisconnect} className="pixel-btn px-4 py-2 text-base">
            {`${account.address.slice(0, 8)}...${account.address.slice(-6)}`}
          </button>
        ) : (
          <button
            disabled={!isReady || Boolean(initializationError)}
            onClick={() => setWalletModalOpen(true)}
            className="pixel-btn pixel-btn--primary px-4 py-2 text-base disabled:opacity-50"
          >
            <span className="inline-flex items-center gap-2">
              <PawPrint size={16} aria-hidden /> Connect Wallet
            </span>
          </button>
        )}
      </div>

      <Modal isOpen={isWalletModalOpen} onClose={() => setWalletModalOpen(false)} title="Connect your wallet">
        <WalletSelector onConnect={() => setWalletModalOpen(false)} />
      </Modal>
    </header>
  )
}

export const Navigation = () => {
  const router = useRouter()
  const currentPath = router.pathname

  if (currentPath === "/") {
    return <MarketingNavigation />
  }

  return <AppNavigation currentPath={currentPath} />
}
