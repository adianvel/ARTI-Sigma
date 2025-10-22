import usePrefersDark from '../hooks/use-prefers-dark'

export const Footer = () => {
  const year = new Date().getFullYear()
  const prefersDark = usePrefersDark()
  const logo = prefersDark ? '/artisigma-logo-white.png' : '/artisigma-logo-blue.png'

  return (
    <footer className="mt-16 border-t border-as-border/40 pt-8 pb-6 text-[0.65rem] uppercase tracking-[0.35em] text-as-muted">
      <div className="flex flex-col gap-6 text-center md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-center gap-4">
          <img src={logo} alt="ARTI Sigma" className="h-8 w-auto" />
          <div className="hidden md:block">(c) {year} Arti - be an original, find an original, art at your finger</div>
        </div>
        <div>Cardano Pre-Production - Immersive Registry Preview</div>
      </div>
    </footer>
  )
}
