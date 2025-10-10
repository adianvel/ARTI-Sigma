import { Mail, MessageCircle, Twitter, Github } from "lucide-react"

const Contact = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-8 pt-8">
      {/* Header Section */}
      <section className="rounded-[40px] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-6 py-12 shadow-[0_28px_80px_rgba(168,85,247,0.25)] ring-1 ring-purple-100 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-purple-600 ring-1 ring-purple-200 mb-6">
          <MessageCircle size={14} />
          Let's Connect
        </span>
        <h1 className="text-4xl font-semibold text-pl-heading sm:text-5xl mb-6">Contact Us</h1>
        <p className="text-lg leading-relaxed text-pl-body opacity-80 max-w-3xl mx-auto">
          Got questions about your pet passport? Want to share feedback? 
          We'd love to hear from the pet community.
        </p>
      </section>

      {/* Contact Cards */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-[32px] bg-gradient-to-br from-blue-50 to-cyan-100 px-6 py-8 shadow-[0_20px_40px_rgba(59,130,246,0.2)] ring-1 ring-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-blue-100 p-3">
              <Mail size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-pl-heading">Email Support</h3>
          </div>
          <p className="text-pl-body opacity-80 leading-relaxed mb-4">
            For questions about pet passports, technical support, or general inquiries.
          </p>
          <a
            href="mailto:support@petlog.io"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            support@petlog.io
          </a>
        </div>

        <div className="rounded-[32px] bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-8 shadow-[0_20px_40px_rgba(34,197,94,0.2)] ring-1 ring-green-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-green-100 p-3">
              <MessageCircle size={24} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-pl-heading">Community Chat</h3>
          </div>
          <p className="text-pl-body opacity-80 leading-relaxed mb-4">
            Join our community Discord for real-time discussions and support.
          </p>
          <span className="text-green-600 font-semibold">Coming Soon</span>
        </div>

        <div className="rounded-[32px] bg-gradient-to-br from-purple-50 to-pink-100 px-6 py-8 shadow-[0_20px_40px_rgba(168,85,247,0.2)] ring-1 ring-purple-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-purple-100 p-3">
              <Twitter size={24} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-pl-heading">Social Media</h3>
          </div>
          <p className="text-pl-body opacity-80 leading-relaxed mb-4">
            Follow us for updates, pet stories, and community highlights.
          </p>
          <span className="text-purple-600 font-semibold">Coming Soon</span>
        </div>

        <div className="rounded-[32px] bg-gradient-to-br from-orange-50 to-red-100 px-6 py-8 shadow-[0_20px_40px_rgba(249,115,22,0.2)] ring-1 ring-orange-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-orange-100 p-3">
              <Github size={24} className="text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-pl-heading">Open Source</h3>
          </div>
          <p className="text-pl-body opacity-80 leading-relaxed mb-4">
            PetLog is open source. Contribute or report issues on GitHub.
          </p>
          <span className="text-orange-600 font-semibold">Coming Soon</span>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="rounded-[32px] bg-gradient-to-r from-rose-200/60 via-white/80 to-orange-200/60 px-6 py-12 shadow-[0_20px_60px_rgba(244,175,208,0.28)] ring-1 ring-rose-100">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-semibold text-pl-heading text-center">Quick Questions</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-pl-heading">🐕 How do I mint a pet passport?</h4>
              <p className="text-pl-body opacity-80 text-sm">
                Visit our mint page, connect your Cardano wallet, and fill out your pet's information.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-pl-heading">💰 What are the costs?</h4>
              <p className="text-pl-body opacity-80 text-sm">
                Minting costs vary based on network fees. Check the mint page for current pricing.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-pl-heading">🔒 Is my pet's data secure?</h4>
              <p className="text-pl-body opacity-80 text-sm">
                Yes! All data is stored on the Cardano blockchain and IPFS for maximum security.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-pl-heading">🌍 Can I use this internationally?</h4>
              <p className="text-pl-body opacity-80 text-sm">
                Pet passports are globally accessible on the blockchain. Acceptance varies by institution.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
