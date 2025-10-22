import Link from 'next/link'

export default function MarketplacePlaceholder() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">Marketplace — Coming soon</h1>
      <p className="mt-4 text-as-muted">
        We're building a curated marketplace to discover originals and fractional offerings. In the
        meantime, explore minting tools and your collection.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/mint" className="pixel-btn pixel-btn--primary px-6 py-3">
          Mint a showcase
        </Link>
        <Link href="/my-collection" className="pixel-btn px-6 py-3">
          My collection
        </Link>
      </div>
    </div>
  )
}
