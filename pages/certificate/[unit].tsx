import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Loader2 } from "lucide-react"
import { ArtMedium, ArtPieceMetadata } from "../../types/passport"
import { ipfsToGateway } from "../../utils/ipfs"

const BLOCKFROST_PROXY_BASE = "/api/blockfrost"

type FileRef = { name?: string; mediaType?: string; src?: string }

type CertificateRecord = {
  assetId: string
  artPiece?: ArtPieceMetadata
  title: string
  artist: string
  description?: string
  medium: ArtMedium | string
  assetUrl: string | null
  mediaType: string | null
  edition?: string
  duration_or_dimensions?: string
  rawMetadata?: any
  files?: FileRef[]
  passport?: any
}

function inferMediaType(url: string | null | undefined, fallback?: string | null) {
  if (fallback) return fallback
  if (!url) return null
  const lower = url.toLowerCase()
  if (lower.endsWith(".mp4")) return "video/mp4"
  if (lower.endsWith(".webm")) return "video/webm"
  if (lower.endsWith(".glb")) return "model/gltf-binary"
  if (lower.endsWith(".gltf")) return "model/gltf+json"
  if (lower.endsWith(".png")) return "image/png"
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg"
  if (lower.endsWith(".webp")) return "image/webp"
  return null
}

async function fetchAssetCertificate(assetUnit: string, blockfrostBase: string): Promise<CertificateRecord | null> {
  const url = `${BLOCKFROST_PROXY_BASE}/assets/${assetUnit}?base=${encodeURIComponent(blockfrostBase)}`
  const resp = await fetch(url)
  if (resp.status === 404) return null
  if (!resp.ok) throw new Error(`Failed to load asset ${assetUnit}`)
  const detail = await resp.json()
  const metadata = detail.onchain_metadata ?? {}
  const raw = detail.onchain_metadata ?? detail
  const files: FileRef[] = Array.isArray(metadata?.files) ? metadata.files : []
  const artPiece = metadata?.art_piece as ArtPieceMetadata | undefined

  if (artPiece) {
    const primaryFile = files.find((f) => f.src === artPiece.file_url) ?? files.find((f) => f.src)
    const assetUrl = ipfsToGateway(artPiece.file_url) ?? ipfsToGateway(primaryFile?.src ?? undefined) ?? null
    return {
      assetId: assetUnit,
      artPiece,
      title: artPiece.title,
      artist: artPiece.artist_name,
      description: artPiece.description,
      medium: artPiece.medium,
      assetUrl,
      mediaType: inferMediaType(assetUrl, primaryFile?.mediaType ?? null),
      edition: artPiece.edition,
      duration_or_dimensions: artPiece.duration_or_dimensions,
      rawMetadata: raw,
      files,
    }
  }

  const imageField = metadata?.image as string | undefined
  const assetUrl = ipfsToGateway(imageField) ?? ipfsToGateway(files.find((f) => f.src)?.src ?? undefined) ?? null
  if (!assetUrl) return null
  return {
    assetId: assetUnit,
    title: metadata?.name ?? detail.asset_name ?? assetUnit,
    artist: metadata?.artist_name ?? "Unknown artist",
    description: metadata?.description,
    medium: (metadata?.medium as ArtMedium) ?? ("Video Art" as ArtMedium),
    assetUrl,
    mediaType: inferMediaType(assetUrl),
    edition: metadata?.edition,
    duration_or_dimensions: metadata?.duration_or_dimensions,
    rawMetadata: raw,
    files,
  }
}

export default function CertificateDetailPage(): JSX.Element | null {
  const router = useRouter()
  const { unit } = router.query
  const [record, setRecord] = useState<CertificateRecord | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [linkedJsons, setLinkedJsons] = useState<Record<string, any> | null>(null)
  const [siblings, setSiblings] = useState<string[] | null>(null)

  const assetUnit = useMemo(() => {
    if (!unit) return null
    return Array.isArray(unit) ? unit[0] : unit
  }, [unit])

  const blockfrostBase = useMemo(() => (process.env.NEXT_PUBLIC_BLOCKFROST_API_URL ?? "https://cardano-preprod.blockfrost.io/api/v0").replace(/\/$/, ""), [])

  useEffect(() => {
    if (!assetUnit) return
    let mounted = true
    setIsLoading(true)
    setError(null)
    fetchAssetCertificate(assetUnit, blockfrostBase)
      .then((r) => {
        if (!mounted) return
        if (!r) {
          setError("This asset does not follow the Arti metadata standard.")
          setRecord(null)
          return
        }
        setRecord(r)
        // try to fetch linked jsons
        if (r.files && r.files.length > 0) {
          const map: Record<string, any> = {}
          Promise.all(
            r.files.map(async (f: FileRef) => {
              if (!f?.src) return
              const src = String(f.src)
              const name = (f.name || src).toString()
              const looksJson = /json|passport|fractional|metadata/i.test(name) || src.toLowerCase().endsWith('.json')
              if (!looksJson) return
              try {
                const gw = ipfsToGateway(src) ?? src
                const resp = await fetch(gw)
                if (!resp.ok) return
                const j = await resp.json().catch(() => null)
                if (j) map[name] = j
              } catch (e) {
                // ignore
              }
            })
          ).then(() => {
            if (mounted && Object.keys(map).length > 0) setLinkedJsons(map)
          })
        }

        // siblings
        try {
          const policyId = assetUnit.slice(0, 56)
          const listUrl = `${BLOCKFROST_PROXY_BASE}/assets/policy/${policyId}?base=${encodeURIComponent(blockfrostBase)}`
          fetch(listUrl)
            .then((resp) => resp.ok ? resp.json() : null)
            .then((list) => {
              if (!mounted || !list) return
              const siblingsList: string[] = Array.isArray(list) ? list.map((l: any) => l.unit as string).filter(Boolean) : []
              setSiblings(siblingsList.filter((u) => u !== assetUnit))
            })
            .catch(() => {})
        } catch (e) {
          // ignore
        }
      })
      .catch((err) => {
        if (!mounted) return
        console.error(err)
        setError(err instanceof Error ? err.message : String(err))
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [assetUnit, blockfrostBase])

  if (!assetUnit) return null
  if (isLoading) return (
    <div className="flex items-center justify-center gap-3 py-16 text-as-muted">
      <Loader2 className="h-6 w-6 animate-spin" />
      Retrieving art piece...
    </div>
  )

  if (error) return (
    <div className="mx-auto max-w-xl rounded-[18px] border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">{error}</div>
  )

  if (!record) return null

  const assetUrl = record.assetUrl
  const isVideo = record.mediaType?.startsWith("video/")
  const isModel = record.mediaType?.includes("model") || assetUrl?.toLowerCase().endsWith(".glb") || assetUrl?.toLowerCase().endsWith(".gltf")

  // Attempt to resolve a fiat price per unit (IDR) from linked passport JSONs or on-chain/raw metadata
  const pricePerUnitIdr: number | null = (() => {
    // 1) linkedJsons may include a passport or fractional JSON with platform_info.fractional.price_primary_idr
    if (linkedJsons) {
      for (const key of Object.keys(linkedJsons)) {
        const v = (linkedJsons as Record<string, any>)[key]
        // common passport shape: platform_info.fractional.price_primary_idr
        let p = v?.platform_info?.fractional?.price_primary_idr ?? v?.platform_info?.fractional?.price_per_unit_idr
        // some JSON files might be the fractional object itself or use top-level price fields
        if (p == null) p = v?.fractional?.price_primary_idr ?? v?.price_primary_idr ?? v?.price_per_unit_idr ?? v?.price
        if (typeof p === 'number' && !Number.isNaN(p)) return p
        if (typeof p === 'string' && p.trim() !== '') {
          // strip common currency markers and commas
          const normalized = p.replace(/[,_\s]/g, '').replace(/IDR|Rp|\$/gi, '')
          const n = Number(normalized)
          if (!Number.isNaN(n)) return n
        }
      }
    }

    // 2) raw on-chain metadata might include fractional pricing
    const raw = record.rawMetadata as any
    const rp = raw?.platform_info?.fractional?.price_primary_idr ?? raw?.price_primary_idr ?? raw?.price_per_unit_idr
    if (typeof rp === 'number' && !Number.isNaN(rp)) return rp
    if (typeof rp === 'string' && rp.trim() !== '') {
      const n = Number(rp)
      if (!Number.isNaN(n)) return n
    }

    return null
  })()

  const totalUnits: number | null = (() => {
    if (linkedJsons) {
      for (const key of Object.keys(linkedJsons)) {
        const v = (linkedJsons as Record<string, any>)[key]
        const t = v?.platform_info?.fractional?.total_units ?? v?.fractional?.total_units ?? v?.total_units
        if (typeof t === 'number' && !Number.isNaN(t)) return t
        if (typeof t === 'string' && t.trim() !== '') {
          const n = Number(t.replace(/[,\s]/g, ''))
          if (!Number.isNaN(n)) return n
        }
      }
    }
    const raw = record.rawMetadata as any
    const rt = raw?.platform_info?.fractional?.total_units ?? raw?.total_units
    if (typeof rt === 'number' && !Number.isNaN(rt)) return rt
    if (typeof rt === 'string' && rt.trim() !== '') {
      const n = Number(rt.replace(/[,\s]/g, ''))
      if (!Number.isNaN(n)) return n
    }
    return null
  })()

  return (
    <div className="mx-auto max-w-6xl pt-12">
      <div className="flex items-start gap-8">
        <div className="w-full max-w-2xl">
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-as-muted">Arti • Certificate</p>
          <h1 className="mt-3 text-3xl font-semibold text-as-heading">{record.title}</h1>
          <p className="text-sm uppercase tracking-[0.35em] text-as-muted mt-1">{record.artist}</p>

          <div className="mt-6 space-y-6 text-sm text-as-muted">
            {/* Price (prominent, above description) */}
            <div className="flex items-baseline gap-4">
              <div>
                <div className="text-[0.6rem] uppercase text-as-muted/70">Price per unit (IDR)</div>
                <div className="mt-1 text-2xl font-semibold text-as-heading">{pricePerUnitIdr != null ? `Rp. ${pricePerUnitIdr.toLocaleString()}` : 'Not listed'}</div>
              </div>
              {totalUnits != null && (
                <div className="text-sm text-as-muted">
                  <div className="text-[0.6rem] uppercase text-as-muted/70">Total units</div>
                  <div className="mt-1 font-medium">{totalUnits}</div>
                </div>
              )}
            </div>

            <section>
              <h3 className="text-sm font-semibold text-as-heading">Description</h3>
              <p className="mt-2 leading-relaxed text-as-body">{record.description ?? (linkedJsons ? Object.values(linkedJsons)[0]?.description ?? 'No description' : 'No description')}</p>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-as-heading">Details</h3>
              <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-[0.6rem] uppercase text-as-muted/70">Asset ID</div>
                  <div className="font-mono break-all mt-1 text-[0.85rem]">{record.assetId}</div>
                </div>
                <div>
                  <div className="text-[0.6rem] uppercase text-as-muted/70">Medium</div>
                  <div className="mt-1 text-[0.85rem]">{record.medium ?? '-'}</div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-as-heading">License & files</h3>
              <div className="mt-2 grid gap-2">
                {record.files && record.files.length > 0 ? record.files.map((f: FileRef, i: number) => (
                  <a key={i} href={ipfsToGateway(f.src ?? '') ?? '#'} className="text-xs text-as-heading underline" target="_blank" rel="noreferrer">{f.name ?? f.src}</a>
                )) : <div className="text-xs">No linked files</div>}
              </div>
            </section>
          </div>

          {siblings && siblings.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-as-heading">Other units</h3>
              <div className="mt-2 grid gap-2">{siblings.map((s: string) => <Link key={s} href={`/certificate/${s}`} className="text-xs text-as-heading underline">{s}</Link>)}</div>
            </div>
          )}
        </div>

        <div className="w-[420px] flex-shrink-0">
          <div className="pixel-card overflow-hidden">
            <div className="relative aspect-square w-full bg-as-highlight/20">
              {isVideo && assetUrl ? (
                <video controls playsInline className="h-full w-full object-cover" muted loop src={assetUrl} />
              ) : isModel && assetUrl ? (
                <model-viewer src={assetUrl} autoplay ar camera-controls style={{ height: '100%', width: '100%', background: 'rgba(255,255,255,0.02)' }} />
              ) : assetUrl ? (
                <img src={assetUrl} alt={record.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-as-muted">No media preview available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
