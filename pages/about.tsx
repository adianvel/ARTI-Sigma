import Link from "next/link"
import { Heart, Shield, Globe, Users } from "lucide-react"

const About = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-8 pt-8">
      {/* Header Section */}
      <section className="rounded-[40px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-6 py-12 shadow-[0_28px_80px_rgba(99,102,241,0.25)] ring-1 ring-indigo-100 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-indigo-600 ring-1 ring-indigo-200 mb-6">
          <Heart size={14} />
          Our Mission
        </span>
        <h1 className="text-4xl font-semibold text-pl-heading sm:text-5xl mb-6">About PetLog</h1>
        <p className="text-lg leading-relaxed text-pl-body opacity-80 max-w-3xl mx-auto">
          Building the future of pet documentation through blockchain technology. 
          We're creating a trusted, decentralized layer for pet identity that connects owners, breeders, and veterinarians.
        </p>
      </section>

      {/* Mission Cards */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-[32px] bg-gradient-to-br from-rose-50 to-pink-100 px-6 py-8 shadow-[0_20px_40px_rgba(244,175,208,0.2)] ring-1 ring-rose-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-rose-100 p-3">
              <Shield size={24} className="text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-pl-heading">Trust & Security</h3>
          </div>
          <p className="text-pl-body opacity-80 leading-relaxed">
            Immutable blockchain records ensure your pet's identity and health history can never be forged or lost.
          </p>
        </div>

        <div className="rounded-[32px] bg-gradient-to-br from-blue-50 to-cyan-100 px-6 py-8 shadow-[0_20px_40px_rgba(59,130,246,0.2)] ring-1 ring-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-blue-100 p-3">
              <Globe size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-pl-heading">Global Standard</h3>
          </div>
          <p className="text-pl-body opacity-80 leading-relaxed">
            Creating a universal standard for pet documentation that works across borders and institutions.
          </p>
        </div>

        <div className="rounded-[32px] bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-8 shadow-[0_20px_40px_rgba(34,197,94,0.2)] ring-1 ring-green-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-green-100 p-3">
              <Users size={24} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-pl-heading">Community Driven</h3>
          </div>
          <p className="text-pl-body opacity-80 leading-relaxed">
            Built by pet lovers, for pet lovers. Every feature is designed with the pet community in mind.
          </p>
        </div>
      </div>

      {/* Vision Section */}
      <section className="rounded-[32px] bg-gradient-to-r from-orange-200/60 via-white/80 to-pink-200/60 px-6 py-12 shadow-[0_20px_60px_rgba(244,175,208,0.28)] ring-1 ring-rose-100">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-semibold text-pl-heading">Our Vision</h2>
          <p className="text-lg text-pl-body opacity-80 leading-relaxed">
            We envision a world where every pet has a verified digital identity that travels with them throughout their life. 
            From birth certificates to medical records, from breeding documentation to ownership transfers – 
            all secured on an immutable, transparent blockchain network.
          </p>
          
          <div className="pt-6">
            <Link
              href="/app"
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 p-1 shadow-[0_20px_60px_rgba(249,115,22,0.4)] transition-all duration-300 hover:shadow-[0_30px_80px_rgba(249,115,22,0.6)] hover:-translate-y-1"
            >
              <div className="rounded-full bg-white px-8 py-4 text-base font-bold text-transparent bg-gradient-to-r from-orange-600 via-pink-600 to-purple-700 bg-clip-text uppercase tracking-[0.2em]">
                Join the Revolution
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="rounded-[32px] bg-white/80 px-6 py-8 shadow-[0_24px_60px_rgba(212,177,189,0.25)] ring-1 ring-rose-100">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-pl-heading">More Coming Soon</h3>
          <p className="text-pl-body opacity-80">
            We are crafting a richer story for this page. For now, keep an eye on the release notes and PetLog updates.
          </p>
        </div>
      </section>
    </div>
  )
}

export default About
