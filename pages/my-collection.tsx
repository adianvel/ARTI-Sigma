import Link from "next/link"
import { GalleryHorizontalEnd, Plus } from "lucide-react"
import { NFTGallery } from "../components/NFTGallery"

const MyCollectionPage = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-8 pt-10 text-as-body">
      <section className="pixel-card px-8 py-12">
        <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-as-border px-5 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-as-muted">
              <GalleryHorizontalEnd size={14} />
              My collection
            </span>
            <h1 className="text-4xl font-semibold text-as-heading sm:text-5xl">
              Curate your on-chain gallery.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-as-muted">
              Connect a Cardano wallet to surface every Arti token you have minted or collected.
              Videos play back in-line, and 3D assets render in-browser so you can review the full
              experience before sharing it with collectors.
            </p>
          </div>

          <Link href="/mint" className="pixel-btn pixel-btn--primary inline-flex items-center gap-2">
            <Plus size={16} aria-hidden />
            Mint new showcase
          </Link>
        </div>
      </section>

      <section className="rounded-[24px] border border-as-border bg-as-surface/80 px-6 py-8 sm:px-8">
        <NFTGallery />
      </section>
    </div>
  )
}

export default MyCollectionPage
