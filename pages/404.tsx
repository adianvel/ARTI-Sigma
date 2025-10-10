import Link from "next/link"
import { Home, Search, ArrowLeft } from "lucide-react"

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto space-y-8">
        {/* 404 Display */}
        <div className="rounded-[40px] bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 px-8 py-12 shadow-[0_28px_80px_rgba(244,63,94,0.25)] ring-1 ring-rose-100">
          <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text mb-4">
            404
          </div>
          <h1 className="text-3xl font-semibold text-pl-heading mb-4">Page Not Found</h1>
          <p className="text-lg text-pl-body opacity-80 leading-relaxed">
            Looks like this pet wandered off! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/">
            <div className="rounded-[24px] bg-gradient-to-br from-blue-50 to-cyan-100 px-6 py-6 shadow-[0_12px_24px_rgba(59,130,246,0.15)] ring-1 ring-blue-100 hover:shadow-[0_16px_32px_rgba(59,130,246,0.2)] transition-all duration-300 cursor-pointer group">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="rounded-2xl bg-blue-100 p-3 group-hover:bg-blue-200 transition-colors">
                  <Home size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-pl-heading">Go Home</h3>
                  <p className="text-sm text-pl-body opacity-70">Back to safety</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/app">
            <div className="rounded-[24px] bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-6 shadow-[0_12px_24px_rgba(34,197,94,0.15)] ring-1 ring-green-100 hover:shadow-[0_16px_32px_rgba(34,197,94,0.2)] transition-all duration-300 cursor-pointer group">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="rounded-2xl bg-green-100 p-3 group-hover:bg-green-200 transition-colors">
                  <Search size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-pl-heading">Explore App</h3>
                  <p className="text-sm text-pl-body opacity-70">Find pet passports</p>
                </div>
              </div>
            </div>
          </Link>

          <div 
            onClick={() => window.history.back()} 
            className="rounded-[24px] bg-gradient-to-br from-purple-50 to-pink-100 px-6 py-6 shadow-[0_12px_24px_rgba(168,85,247,0.15)] ring-1 ring-purple-100 hover:shadow-[0_16px_32px_rgba(168,85,247,0.2)] transition-all duration-300 cursor-pointer group"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="rounded-2xl bg-purple-100 p-3 group-hover:bg-purple-200 transition-colors">
                <ArrowLeft size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-pl-heading">Go Back</h3>
                <p className="text-sm text-pl-body opacity-70">Previous page</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fun Pet Emoji */}
        <div className="text-6xl opacity-50">
          🐕‍🦺
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
