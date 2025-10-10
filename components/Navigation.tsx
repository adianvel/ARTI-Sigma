import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { Cat, PawPrint, Home } from "lucide-react"
import { Modal } from "./Modal"
import { WalletSelector } from "./WalletSelector"
import { useLucid } from "../contexts/LucidContext"

const navLinkClass = (active: boolean) =>
  [
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition-all duration-200",
    active
      ? "bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300 text-white shadow-[0_8px_24px_rgba(244,175,208,0.4)]"
      : "bg-white/60 text-pl-heading hover:bg-white/80 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] ring-1 ring-rose-100",
  ].join(" ")

const MarketingNavigation = () => {
  return (
    <header className="flex items-center justify-center py-8">
      <Link href="/" className="rounded-full bg-white/90 px-6 py-3 shadow-[0_18px_36px_rgba(244,175,208,0.35)] ring-1 ring-rose-100 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(244,175,208,0.45)]">
        <img
          src="/Petlog-logo.png"
          alt="PetLog - Digital Pet Passport Platform"
          className="h-8 w-auto"
        />
      </Link>
    </header>
  )
}

const AppNavigation = ({ currentPath }: { currentPath: string }) => {
  const { account, disconnect, isReady, network, initializationError } = useLucid()
  const [isWalletModalOpen, setWalletModalOpen] = useState(false)

  const links = useMemo(
    () => [
      { href: "/app", label: "Home", icon: Home },
      { href: "/my-passports", label: "Pet Crew", icon: Cat },
      { href: "/mint", label: "Create", icon: PawPrint },
    ],
    []
  )

  const handleDisconnect = () => {
    disconnect()
  }

  return (
    <header className="rounded-[32px] bg-white/80 mx-4 mt-6 px-6 py-4 shadow-[0_20px_40px_rgba(212,177,189,0.25)] ring-1 ring-rose-100 sm:mx-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <img
            src="/Petlog-logo.png"
            alt="PetLog - Digital Pet Passport Platform"
            className="h-8 w-auto"
          />
        </Link>

        <nav className="flex items-center gap-2">
          {links.map((link) => {
            const ActiveIcon = link.icon
            const isActive = currentPath === link.href
            return (
              <Link key={link.href} href={link.href} className={navLinkClass(isActive)}>
                {ActiveIcon ? <ActiveIcon size={16} aria-hidden /> : null}
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs uppercase tracking-[0.2em] text-pl-muted">
              Network: {network}
            </span>
            {account && (
              <span className="text-xs text-pl-muted">
                {`${account.address.slice(0, 8)}...${account.address.slice(-6)}`}
              </span>
            )}
          </div>
          {account ? (
            <button 
              onClick={handleDisconnect} 
              className="rounded-full bg-white/60 px-4 py-2 text-sm font-semibold text-pl-heading ring-1 ring-rose-100 hover:bg-white/80 transition-all duration-200"
            >
              Disconnect
            </button>
          ) : (
            <button
              disabled={!isReady || Boolean(initializationError)}
              onClick={() => setWalletModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(244,175,208,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(244,175,208,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PawPrint size={16} aria-hidden /> 
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </button>
          )}
        </div>
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
