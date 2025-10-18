export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-as-border/40 pt-8 pb-6 text-[0.65rem] uppercase tracking-[0.35em] text-as-muted">
      <div className="flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between">
        <p>(c) {year} Arti - Built for immersive art provenance</p>
        <p>Cardano Pre-Production - Immersive Registry Preview</p>
      </div>
    </footer>
  )
}
