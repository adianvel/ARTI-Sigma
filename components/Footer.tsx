export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      <div className="flex flex-col gap-2 text-center md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} PetLog. All rights reserved.</p>
        <p className="text-xs">
          Built for Cardano Pre-Production · Level 1 Self-Attested Certificates
        </p>
      </div>
    </footer>
  )
}
