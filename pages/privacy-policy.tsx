import { Shield, Lock, Eye, FileCheck } from "lucide-react"

const PrivacyPolicy = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-8 pt-8">
      {/* Header Section */}
      <section className="rounded-[40px] bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50 px-6 py-12 shadow-[0_28px_80px_rgba(34,197,94,0.25)] ring-1 ring-green-100 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-green-600 ring-1 ring-green-200 mb-6">
          <Shield size={14} />
          Privacy First
        </span>
        <h1 className="text-4xl font-semibold text-pl-heading sm:text-5xl mb-6">Privacy Policy</h1>
        <p className="text-lg leading-relaxed text-pl-body opacity-80 max-w-3xl mx-auto">
          Your privacy matters. Here's how we handle your personal and pet data with transparency and security.
        </p>
      </section>

      {/* Key Principles */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[32px] bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-8 shadow-[0_20px_40px_rgba(59,130,246,0.2)] ring-1 ring-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-blue-100 p-3">
              <Lock size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-pl-heading">Blockchain Security</h3>
          </div>
          <p className="text-pl-body opacity-80 leading-relaxed">
            PetLog stores only the metadata required to mint your NFT passport. 
            Self-attested details remain in your custody and are published to IPFS only with your consent.
          </p>
        </div>

        <div className="rounded-[32px] bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-8 shadow-[0_20px_40px_rgba(34,197,94,0.2)] ring-1 ring-green-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-green-100 p-3">
              <FileCheck size={24} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-pl-heading">Minimal Data Collection</h3>
          </div>
          <p className="text-pl-body opacity-80 leading-relaxed">
            We collect only the information necessary to create and maintain your pet's 
            blockchain-based passport. No unnecessary personal data is stored.
          </p>
        </div>

        <div className="rounded-[32px] bg-gradient-to-br from-purple-50 to-pink-100 px-6 py-8 shadow-[0_20px_40px_rgba(168,85,247,0.2)] ring-1 ring-purple-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-purple-100 p-3">
              <Eye size={24} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-pl-heading">Full Transparency</h3>
          </div>
          <p className="text-pl-body opacity-80 leading-relaxed">
            All pet passport data is publicly viewable on the blockchain. 
            You have complete visibility into what information is stored and how it's used.
          </p>
        </div>

        <div className="rounded-[32px] bg-gradient-to-br from-orange-50 to-red-100 px-6 py-8 shadow-[0_20px_40px_rgba(249,115,22,0.2)] ring-1 ring-orange-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-orange-100 p-3">
              <Shield size={24} className="text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-pl-heading">Your Ownership Rights</h3>
          </div>
          <p className="text-pl-body opacity-80 leading-relaxed">
            You maintain full ownership and control of your pet's passport NFT 
            and all associated data. Transfer or modify as you see fit.
          </p>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-6">
        <div className="rounded-[32px] bg-white/80 px-6 py-8 shadow-[0_24px_60px_rgba(212,177,189,0.25)] ring-1 ring-rose-100">
          <h2 className="text-2xl font-semibold text-pl-heading mb-4">What We Collect</h2>
          <div className="space-y-3 text-pl-body opacity-80">
            <p>• <strong>Pet Information:</strong> Name, species, breed, age, and identifying characteristics</p>
            <p>• <strong>Health Records:</strong> Vaccination status, medical history (if provided)</p>
            <p>• <strong>Images:</strong> Photos of your pet for identification purposes</p>
            <p>• <strong>Wallet Address:</strong> Your Cardano wallet address for NFT ownership</p>
          </div>
        </div>

        <div className="rounded-[32px] bg-white/80 px-6 py-8 shadow-[0_24px_60px_rgba(212,177,189,0.25)] ring-1 ring-rose-100">
          <h2 className="text-2xl font-semibold text-pl-heading mb-4">How We Use Your Data</h2>
          <div className="space-y-3 text-pl-body opacity-80">
            <p>• <strong>Passport Creation:</strong> Generate unique NFT-based pet passports</p>
            <p>• <strong>Verification:</strong> Enable pet identity verification by third parties</p>
            <p>• <strong>Network Storage:</strong> Store data permanently on blockchain infrastructure</p>
            <p>• <strong>Service Improvement:</strong> Analyze usage patterns to enhance our platform</p>
          </div>
        </div>

        <div className="rounded-[32px] bg-white/80 px-6 py-8 shadow-[0_24px_60px_rgba(212,177,189,0.25)] ring-1 ring-rose-100">
          <h2 className="text-2xl font-semibold text-pl-heading mb-4">Third-Party Access</h2>
          <div className="space-y-3 text-pl-body opacity-80">
            <p>• <strong>Blockchain Networks:</strong> Data is stored on public Cardano blockchain</p>
            <p>• <strong>IPFS Storage:</strong> Images and metadata stored on distributed IPFS network</p>
            <p>• <strong>Wallet Providers:</strong> Integration with Cardano wallet services</p>
            <p>• <strong>No Selling:</strong> We never sell your personal or pet data to third parties</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="rounded-[32px] bg-gradient-to-r from-cyan-200/60 via-white/80 to-blue-200/60 px-6 py-12 shadow-[0_20px_60px_rgba(59,130,246,0.28)] ring-1 ring-blue-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-semibold text-pl-heading">Questions About Privacy?</h2>
          <p className="text-pl-body opacity-80">
            If you have any questions about how we handle your data or want to exercise your privacy rights,
            please contact us at <a href="mailto:privacy@petlog.io" className="text-blue-600 hover:text-blue-700 font-semibold">privacy@petlog.io</a>
          </p>
          <p className="text-sm text-pl-body opacity-60">
            Last updated: December 2024
          </p>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicy
