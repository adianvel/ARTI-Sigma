import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { Cat, PawPrint } from "lucide-react"
import { Modal } from "./Modal"
import { WalletSelector } from "./WalletSelector"
import { useLucid } from "../contexts/LucidContext"

const navLinkClass = (active: boolean) =>
  `text-sm font-medium transition hover:text-blue-600 ${active ? "text-blue-600" : "text-slate-600 dark:text-slate-300"}`

export const Navigation = () => {
  const router = useRouter()
  const { account, disconnect, isReady, network } = useLucid()
  const [isWalletModalOpen, setWalletModalOpen] = useState(false)

  const links = useMemo(
    () => [
      { href: "/", label: "Home", icon: null as any },
      { href: "/my-passports", label: "My Cat Crew", icon: Cat },
    ],
    []
  )

  const handleDisconnect = () => {
    disconnect()
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 py-6">
      <Link href="/" className="text-xl font-semibold text-slate-900 dark:text-slate-50">
        PetLog
      </Link>

      <nav className="flex items-center gap-6">
        {links.map((link) => {
          const ActiveIcon = link.icon
          return (
            <Link key={link.href} href={link.href} className={navLinkClass(router.pathname === link.href)}>
              <span className="inline-flex items-center gap-2">
                {ActiveIcon ? <ActiveIcon size={18} /> : null}
                {link.label}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-slate-500 md:inline">Network: {network}</span>
        {account ? (
          <button
            onClick={handleDisconnect}
            className="pixel-btn bg-white px-4 py-2 text-xs"
          >
            {`${account.address.slice(0, 8)}...${account.address.slice(-6)}`}
          </button>
        ) : (
          <button
            disabled={!isReady}
            onClick={() => setWalletModalOpen(true)}
            className="pixel-btn pixel-btn--primary px-4 py-2 text-xs disabled:opacity-60"
          >
            <span className="inline-flex items-center gap-2">
              <PawPrint size={16} /> Connect Wallet
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
