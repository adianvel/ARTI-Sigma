import { Scale, Code, Heart, FileText } from "lucide-react"

const Licensing = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-8 pt-8">
      {/* Header Section */}
      <section className="rounded-[40px] bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 px-6 py-12 shadow-[0_28px_80px_rgba(245,158,11,0.25)] ring-1 ring-amber-100 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-amber-600 ring-1 ring-amber-200 mb-6">
          <Scale size={14} />
          Open Source
        </span>
        <h1 className="text-4xl font-semibold text-pl-heading sm:text-5xl mb-6">Licensing</h1>
        <p className="text-lg leading-relaxed text-pl-body opacity-80 max-w-3xl mx-auto">
          PetLog is built with transparency and community collaboration at its core. 
          Here's everything you need to know about our licensing terms.
        </p>
      </section>

      {/* License Cards */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[32px] bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-8 shadow-[0_20px_40px_rgba(34,197,94,0.2)] ring-1 ring-green-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-green-100 p-3">
              <Code size={24} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-pl-heading">MIT License</h3>
          </div>
          <p className="text-pl-body opacity-80 leading-relaxed mb-4">
            PetLog source code is released under the MIT License. You are free to use, modify, 
            and distribute the software for any purpose, including commercial use.
          </p>
          <div className="space-y-2 text-sm text-pl-body opacity-70">
            <p>✓ Use commercially</p>
            <p>✓ Modify the source</p>
            <p>✓ Distribute freely</p>
            <p>✓ Private use allowed</p>
          </div>
        </div>

        <div className="rounded-[32px] bg-gradient-to-br from-blue-50 to-cyan-100 px-6 py-8 shadow-[0_20px_40px_rgba(59,130,246,0.2)] ring-1 ring-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-blue-100 p-3">
              <Heart size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-pl-heading">Testnet Period</h3>
          </div>
          <p className="text-pl-body opacity-80 leading-relaxed mb-4">
            All artwork and copy within PetLog are provided for non-commercial use during the testnet period. 
            Formal licensing terms will ship with the production launch.
          </p>
          <div className="space-y-2 text-sm text-pl-body opacity-70">
            <p>• Non-commercial use allowed</p>
            <p>• Educational purposes welcomed</p>
            <p>• Attribution appreciated</p>
            <p>• Commercial terms coming soon</p>
          </div>
        </div>

        <div className="rounded-[32px] bg-gradient-to-br from-purple-50 to-pink-100 px-6 py-8 shadow-[0_20px_40px_rgba(168,85,247,0.2)] ring-1 ring-purple-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-purple-100 p-3">
              <FileText size={24} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-pl-heading">Terms of Use</h3>
          </div>
          <p className="text-pl-body opacity-80 leading-relaxed">
            By using PetLog, you agree to use the platform responsibly and in accordance 
            with all applicable laws and regulations. No warranty is provided.
          </p>
        </div>

        <div className="rounded-[32px] bg-gradient-to-br from-orange-50 to-red-100 px-6 py-8 shadow-[0_20px_40px_rgba(249,115,22,0.2)] ring-1 ring-orange-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-orange-100 p-3">
              <Scale size={24} className="text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-pl-heading">Liability</h3>
          </div>
          <p className="text-pl-body opacity-80 leading-relaxed">
            PetLog is provided "as is" without warranty. Users are responsible for 
            ensuring their pet data is accurate and for backing up their NFT assets.
          </p>
        </div>
      </div>

      {/* Brand Usage */}
      <div className="rounded-[32px] bg-white/80 px-6 py-8 shadow-[0_24px_60px_rgba(212,177,189,0.25)] ring-1 ring-rose-100">
        <h2 className="text-2xl font-semibold text-pl-heading mb-6">Brand & Asset Usage</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="font-semibold text-pl-heading text-lg">✅ Allowed</h4>
            <div className="space-y-2 text-sm text-pl-body opacity-80">
              <p>• Educational presentations about blockchain pets</p>
              <p>• Academic research and documentation</p>
              <p>• Non-commercial blog posts and articles</p>
              <p>• Contributing to the open source project</p>
              <p>• Sharing screenshots for feedback</p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-pl-heading text-lg">❌ Not Allowed</h4>
            <div className="space-y-2 text-sm text-pl-body opacity-80">
              <p>• Commercial use of PetLog branding</p>
              <p>• Selling products with PetLog logos</p>
              <p>• Creating competing services with our assets</p>
              <p>• Misrepresenting PetLog's official position</p>
              <p>• Using assets in harmful or illegal content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <section className="rounded-[32px] bg-gradient-to-r from-yellow-200/60 via-white/80 to-amber-200/60 px-6 py-12 shadow-[0_20px_60px_rgba(245,158,11,0.28)] ring-1 ring-amber-100">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-semibold text-pl-heading">Questions About Usage?</h2>
          <p className="text-lg text-pl-body opacity-80 leading-relaxed">
            Want to use PetLog assets in your project? Have questions about licensing? 
            We're here to help and excited to see what you'll build.
          </p>
          
          <div className="pt-4">
            <a
              href="mailto:licensing@petlog.io"
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 p-1 shadow-[0_20px_60px_rgba(245,158,11,0.4)] transition-all duration-300 hover:shadow-[0_30px_80px_rgba(245,158,11,0.6)] hover:-translate-y-1"
            >
              <div className="rounded-full bg-white px-8 py-4 text-base font-bold text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 bg-clip-text uppercase tracking-[0.2em]">
                Contact Us
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Licensing
