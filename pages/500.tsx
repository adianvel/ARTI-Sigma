import Link from "next/link"
import { Home, RefreshCw, Mail, AlertTriangle } from "lucide-react"

const ServerError = () => {
  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto space-y-8">
        {/* 500 Display */}
        <div className="rounded-[40px] bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 px-8 py-12 shadow-[0_28px_80px_rgba(249,115,22,0.25)] ring-1 ring-orange-100">
          <div className="flex justify-center mb-4">
            <div className="rounded-3xl bg-orange-100 p-4">
              <AlertTriangle size={48} className="text-orange-600" />
            </div>
          </div>
          <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text mb-4">
            500
          </div>
          <h1 className="text-3xl font-semibold text-pl-heading mb-4">Server Error</h1>
          <p className="text-lg text-pl-body opacity-80 leading-relaxed">
            Our servers are having a ruff time! Something went wrong on our end. 
            Don't worry, our team has been notified and is working on a fix.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <div 
            onClick={() => window.location.reload()} 
            className="rounded-[24px] bg-gradient-to-br from-blue-50 to-cyan-100 px-6 py-6 shadow-[0_12px_24px_rgba(59,130,246,0.15)] ring-1 ring-blue-100 hover:shadow-[0_16px_32px_rgba(59,130,246,0.2)] transition-all duration-300 cursor-pointer group"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="rounded-2xl bg-blue-100 p-3 group-hover:bg-blue-200 transition-colors">
                <RefreshCw size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-pl-heading">Try Again</h3>
                <p className="text-sm text-pl-body opacity-70">Reload the page</p>
              </div>
            </div>
          </div>

          <Link href="/">
            <div className="rounded-[24px] bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-6 shadow-[0_12px_24px_rgba(34,197,94,0.15)] ring-1 ring-green-100 hover:shadow-[0_16px_32px_rgba(34,197,94,0.2)] transition-all duration-300 cursor-pointer group">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="rounded-2xl bg-green-100 p-3 group-hover:bg-green-200 transition-colors">
                  <Home size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-pl-heading">Go Home</h3>
                  <p className="text-sm text-pl-body opacity-70">Back to safety</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/contact">
            <div className="rounded-[24px] bg-gradient-to-br from-purple-50 to-pink-100 px-6 py-6 shadow-[0_12px_24px_rgba(168,85,247,0.15)] ring-1 ring-purple-100 hover:shadow-[0_16px_32px_rgba(168,85,247,0.2)] transition-all duration-300 cursor-pointer group">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="rounded-2xl bg-purple-100 p-3 group-hover:bg-purple-200 transition-colors">
                  <Mail size={24} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-pl-heading">Contact Us</h3>
                  <p className="text-sm text-pl-body opacity-70">Report the issue</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Status Info */}
        <div className="rounded-[24px] bg-white/80 px-6 py-4 shadow-[0_12px_24px_rgba(212,177,189,0.15)] ring-1 ring-rose-100">
          <p className="text-sm text-pl-body opacity-70">
            If this problem persists, please contact our support team at{" "}
            <a href="mailto:support@petlog.io" className="text-blue-600 hover:text-blue-700 font-semibold">
              support@petlog.io
            </a>
          </p>
        </div>

        {/* Sad Pet Emoji */}
        <div className="text-6xl opacity-50">
          🐕‍💔
        </div>
      </div>
    </div>
  )
}

export default ServerError
