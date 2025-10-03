export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-pl-border pt-8 pb-6 text-base text-pl-muted">
      <div className="flex flex-col gap-2 text-center tracking-[0.18em] md:flex-row md:items-center md:justify-between">
        <p>(c) {new Date().getFullYear()} PetLog. All rights reserved.</p>
        <p className="text-base uppercase">
          Built for Cardano Pre-Production - Level 1 Self-Attested Certificates
        </p>
      </div>
    </footer>
  )
}
