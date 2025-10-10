export const Footer = () => {
  return (
    <footer className="mt-16 rounded-t-[32px] bg-gradient-to-b from-gray-50 to-white px-6 py-8 shadow-[0_-20px_40px_rgba(0,0,0,0.05)] ring-1 ring-gray-100">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <img 
              src="/Petlog-logo.png" 
              alt="PetLog" 
              className="h-8 w-auto"
            />
            <p className="text-pl-body opacity-70">
              © {new Date().getFullYear()} PetLog. All rights reserved.
            </p>
          </div>
          <div className="rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 ring-1 ring-blue-200">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Built for Cardano Pre-Production
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-center text-xs text-pl-body opacity-60">
            Level 1 Self-Attested Certificates • Powered by Blockchain Technology
          </p>
        </div>
      </div>
    </footer>
  )
}
