import Link from "next/link"
import Image from "next/image"
import usePrefersDark from '../hooks/use-prefers-dark'
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
      ? "border-as-borderStrong bg-as-highlight/40 text-as-primary shadow-pixel-sm"
      : "border-transparent text-as-muted hover:border-as-border hover:bg-as-highlight/20 hover:text-as-primary",
  ].join(" ")

const BRAND_COLOR = "#2F61FF"

const BrandMark = () => {
  const prefersDark = usePrefersDark()
  const logo = prefersDark ? '/artisigma-logo-white.png' : '/artisigma-logo-blue.png'
  return (
    <Link href="/" className="group inline-flex items-center gap-3 text-left leading-tight">
      <Image src={logo} alt="ARTI Sigma" width={120} height={40} priority />
    </Link>
  )
}

const MarketingNavigation = () => (
  <header className="flex items-center justify-between py-8">
    <BrandMark />
    <div className="flex items-center gap-3">
      <Link href="/marketplace" className="pixel-btn px-5 py-2 text-[0.65rem]">
        Marketplace
      </Link>
      <Link href="/mint" className="pixel-btn pixel-btn--primary px-6 py-2 text-[0.65rem]">
        Mint a showcase
      </Link>
    </div>
  </header>
)

const AppNavigation = ({ currentPath }: { currentPath: string }) => {
  const { account, disconnect, isReady, network, initializationError } = useLucid()
  const [isWalletModalOpen, setWalletModalOpen] = useState(false)

  const links = useMemo(
    () => [
      { href: "/app", label: "Studio", icon: Shapes },
  { href: "/my-collection", label: "My collection", icon: GalleryHorizontalEnd },
      { href: "/marketplace", label: "Marketplace", icon: GalleryHorizontalEnd },
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
