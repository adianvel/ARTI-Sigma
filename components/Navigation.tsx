import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { Sparkles, Shapes, GalleryHorizontalEnd, Wallet } from "lucide-react"
import { Modal } from "./Modal"
import { WalletSelector } from "./WalletSelector"
import { useLucid } from "../contexts/LucidContext"

const navLinkClass = (active: boolean) =>
  [
    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition-all duration-200",
    active
      ? "border-as-borderStrong bg-as-highlight/40 text-as-heading shadow-pixel-sm"
      : "border-transparent text-as-muted hover:border-as-border hover:bg-as-highlight/20 hover:text-as-heading",
  ].join(" ")

const BRAND_COLOR = "#2F61FF"

const BrandMark = () => (
  <Link href="/" className="group inline-flex flex-col text-left leading-tight">
    <span
      className="text-sm font-semibold uppercase tracking-[0.45em] transition-colors group-hover:text-as-heading"
      style={{ color: BRAND_COLOR }}
    >
      ARTI Sigma
    </span>
    <span className="text-[0.7rem] uppercase tracking-[0.4em] text-as-muted transition-colors group-hover:text-as-heading">
      Immersive registry
    </span>
  </Link>
)

const MarketingNavigation = () => (
  <header className="flex items-center justify-between py-8">
    <BrandMark />
    <Link href="/mint" className="pixel-btn pixel-btn--primary px-6 py-2 text-[0.65rem]">
      Mint a showcase
    </Link>
  </header>
)

const AppNavigation = ({ currentPath }: { currentPath: string }) => {
  const { account, disconnect, isReady, network, initializationError } = useLucid()
  const [isWalletModalOpen, setWalletModalOpen] = useState(false)

  const links = useMemo(
    () => [
      { href: "/app", label: "Studio", icon: Shapes },
      { href: "/my-passports", label: "My collection", icon: GalleryHorizontalEnd },
      { href: "/mint", label: "Tokenize", icon: Sparkles },
    ],
    []
  )

  return (
    <header className="mt-6 rounded-[26px] border border-as-border bg-as-surface/60 px-6 py-5 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <BrandMark />

        <nav className="flex items-center gap-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = currentPath === link.href
            return (
              <Link key={link.href} href={link.href} className={navLinkClass(isActive)}>
                {Icon ? <Icon size={14} aria-hidden /> : null}
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-[0.6rem] uppercase tracking-[0.35em] text-as-muted md:flex md:flex-col md:items-end">
            <span>Network - {network}</span>
            {account && (
              <span>{`${account.address.slice(0, 6)}...${account.address.slice(-5)}`}</span>
            )}
          </div>
          {account ? (
            <button onClick={disconnect} className="pixel-btn px-5 py-2 text-[0.6rem]">
              Disconnect
            </button>
          ) : (
            <button
              disabled={!isReady || Boolean(initializationError)}
              onClick={() => setWalletModalOpen(true)}
              className="pixel-btn pixel-btn--primary inline-flex items-center gap-2 px-5 py-2 text-[0.6rem] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Wallet size={14} aria-hidden />
              Connect wallet
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isWalletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        title="Connect your wallet"
      >
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
