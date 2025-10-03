import { useRouter } from "next/router"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type AssetDetail = {
  asset: string
  policy_id: string
  asset_name: string
  fingerprint: string
  onchain_metadata?: any
  onchain_metadata_standard?: string
  onchain_metadata_extra?: any
}

const ipfsToHttp = (url?: string | null) => {
  if (!url) return null
  if (!url.startsWith("ipfs://")) return url
  const stripped = url.replace("ipfs://", "").replace(/^ipfs\//i, "")
  if (!stripped) return null
  const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "https://ipfs.io/ipfs/"
  return `${gateway}${stripped}`
}

export default function AssetDetailPage() {
  const router = useRouter()
  const { unit } = router.query
  const [detail, setDetail] = useState<AssetDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const unitString = useMemo(() => (Array.isArray(unit) ? unit[0] : unit) || "", [unit])
  const explorerBase = process.env.NEXT_PUBLIC_EXPLORER_ASSET_URL ?? "https://preprod.cexplorer.io/asset/"

  useEffect(() => {
    const run = async () => {
      if (!unitString) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/blockfrost/assets/${encodeURIComponent(unitString)}`)
        if (!res.ok) throw new Error(`Failed to fetch asset (${res.status})`)
        const json = (await res.json()) as AssetDetail
        setDetail(json)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load asset")
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [unitString])

  const name = detail?.onchain_metadata?.name ?? detail?.asset_name ?? detail?.asset ?? "Asset"
  const description = detail?.onchain_metadata?.description ?? ""
  const imageUrl = ipfsToHttp(detail?.onchain_metadata?.image)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-pl-body">
        <div className="pixel-loader" />
        <p className="mt-3 text-lg text-pl-muted">Loading NFT details…</p>
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-center text-[color:var(--color-danger)]">{error}</p>
    )
  }

  if (!detail) return null

  return (
    <section className="space-y-8 text-pl-body">
      <header className="flex flex-col gap-2 text-center sm:text-left">
        <h1 className="font-display text-2xl tracking-[0.2em] text-pl-heading">{name}</h1>
        <p className="break-all text-sm uppercase tracking-[0.25em] text-pl-muted">{detail.asset}</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <Link href="/my-passports" className="pixel-btn px-4 py-2 text-base uppercase tracking-[0.3em]">
          Back to My Cat Crew
        </Link>
        <a
          href={`${explorerBase}${encodeURIComponent(unitString)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-btn pixel-btn--primary px-4 py-2 text-base uppercase tracking-[0.3em]"
        >
          View on Explorer
        </a>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="pixel-card p-4">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full" />
          ) : (
            <div className="flex h-64 items-center justify-center text-pl-muted">No image</div>
          )}
        </div>

        <div className="pixel-card p-4 text-base">
          {description && (
            <div className="mb-4 space-y-2">
              <h2 className="font-display text-lg tracking-[0.2em] text-pl-heading">Description</h2>
              <p className="whitespace-pre-wrap leading-relaxed text-pl-body">{description}</p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pl-muted">Policy ID</p>
              <p className="mt-1 break-all font-mono text-pl-heading">{detail.policy_id}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pl-muted">Fingerprint</p>
              <p className="mt-1 break-all font-mono text-pl-heading">{detail.fingerprint}</p>
            </div>
            {detail.onchain_metadata_standard && (
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-pl-muted">Standard</p>
                <p className="mt-1">{detail.onchain_metadata_standard}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pixel-card p-4">
        <h2 className="font-display text-lg tracking-[0.2em] text-pl-heading">On-chain Metadata</h2>
        <pre className="mt-3 max-h-96 overflow-auto rounded-pixel border border-pl-border bg-pl-background p-3 text-sm leading-snug text-pl-body">
          {JSON.stringify(detail.onchain_metadata ?? {}, null, 2)}
        </pre>
      </div>
    </section>
  )
}


