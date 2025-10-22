import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Loader2, ImageOff } from "lucide-react"
import { useLucid } from "../contexts/LucidContext"
import { ArtMedium, ArtPieceMetadata } from "../types/passport"

const BLOCKFROST_PROXY_BASE = "/api/blockfrost"

type AssetPreview = {
  assetId: string
  title: string
  artist: string
  medium: ArtMedium
  assetUrl: string | null
  mediaType: string | null
  edition?: string
  duration_or_dimensions?: string
  // group support
  units?: string[]
}

const ipfsToGateway = (url: unknown): string | null => {
  if (!url) return null
  if (typeof url === "object" && url !== null) {
    if ("src" in (url as any)) {
      return ipfsToGateway((url as any).src)
    }
    return null
  }
  if (typeof url !== "string") return null
  if (!url.startsWith("ipfs://")) return url
  const cid = url.replace("ipfs://", "").replace(/^ipfs\//i, "")
  const gateway =
    process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "https://purple-persistent-booby-135.mypinata.cloud/ipfs/"
  return `${gateway}${cid}`
}

const fetchFromBlockfrost = async (url: string) => {
  const response = await fetch(url)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Blockfrost request failed (${response.status})`)
  }

  return response.json()
}

const loadModelViewer = async () => {
  if (typeof window === "undefined") return false
  if ((window as any).__modelViewerLoaded) return true

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.type = "module"
    script.async = true
    script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
    script.onload = () => {
      ;(window as any).__modelViewerLoaded = true
      resolve()
    }
    script.onerror = () => reject(new Error("Failed to load model-viewer"))
    document.head.appendChild(script)
  })

  return true
}

const inferMediaType = (url: string | null | undefined, fallback?: string | null) => {
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

const fetchAssetUnitsForAddress = async (address: string, blockfrostBase: string) => {
  const assetsUrl = `${BLOCKFROST_PROXY_BASE}/addresses/${encodeURIComponent(
    address
  )}/assets?base=${encodeURIComponent(blockfrostBase)}`
  const direct = await fetchFromBlockfrost(assetsUrl)
  if (Array.isArray(direct)) {
    return direct.map((item) => ({ unit: item.unit as string }))
  }

  const utxosUrl = `${BLOCKFROST_PROXY_BASE}/addresses/${encodeURIComponent(
    address
  )}/utxos?base=${encodeURIComponent(blockfrostBase)}`
  const utxos = await fetchFromBlockfrost(utxosUrl)
  const utxoList: Array<{ amount?: Array<{ unit?: string }> }> = Array.isArray(utxos)
    ? utxos
    : Array.isArray((utxos as any)?.value)
    ? (utxos as any).value
    : []

  const uniqueUnits = new Map<string, true>()
  for (const utxo of utxoList) {
    if (!Array.isArray(utxo.amount)) continue
    for (const entry of utxo.amount) {
      const unit = entry?.unit
      if (unit && unit !== "lovelace") {
        uniqueUnits.set(unit, true)
      }
    }
  }

  return Array.from(uniqueUnits.keys()).map((unit) => ({ unit }))
}

const isArtiDetail = (detail: any) => {
  const md = detail?.onchain_metadata ?? {}
  if (md?.art_piece) return true
  if (Array.isArray(md?.files) && md.files.find((f: any) => f && (f.name === 'ArtworksIDPassport' || f.name === 'Arti Metadata'))) return true
  return false
}

const toPreview = (assetUnit: string, detail: any): AssetPreview | null => {
  // only surface ARTI-standard tokens
  if (!isArtiDetail(detail)) return null
  const metadata = detail?.onchain_metadata ?? {}
  const files: Array<{ name?: string; mediaType?: string; src?: string }> = Array.isArray(
    metadata?.files
  )
    ? metadata.files
    : []
  const artPiece = metadata?.art_piece as ArtPieceMetadata | undefined

  if (artPiece) {
    const primaryFile =
      files.find((file) => file.src === artPiece.file_url) ?? files.find((file) => file.src)

    const assetUrl =
      ipfsToGateway(artPiece.file_url) ?? ipfsToGateway(primaryFile?.src ?? undefined)

    return {
      assetId: assetUnit,
      title: artPiece.title,
      artist: artPiece.artist_name,
      medium: artPiece.medium,
      assetUrl,
      mediaType: primaryFile?.mediaType ?? inferMediaType(artPiece.file_url),
      edition: artPiece.edition,
      duration_or_dimensions: artPiece.duration_or_dimensions,
      units: [assetUnit],
    }
  }

  const certificate = metadata?.certificate as
    | {
        core_data?: { title?: string; artist_name?: string; thumbnail_url?: string }
        digital_asset?: { high_res_file_url?: string; file_type?: string }
      }
    | undefined

  if (certificate?.core_data && certificate?.digital_asset) {
    const srcUrl =
      certificate.digital_asset.high_res_file_url ?? certificate.core_data.thumbnail_url ?? null
    const assetUrl = ipfsToGateway(srcUrl)

    return {
      assetId: assetUnit,
      title: certificate.core_data.title ?? detail.asset_name ?? "Untitled",
      artist: certificate.core_data.artist_name ?? "Unknown artist",
      medium: "Video Art" as ArtMedium,
      assetUrl,
      mediaType:
        certificate.digital_asset.file_type ?? inferMediaType(srcUrl, certificate.digital_asset.file_type),
      edition: undefined,
      duration_or_dimensions: undefined,
      units: [assetUnit],
    }
  }

  const imageField = metadata?.image as string | undefined
  const assetUrl = ipfsToGateway(imageField)
  if (!assetUrl) return null

  return {
    assetId: assetUnit,
    title: metadata?.name ?? detail?.asset_name ?? assetUnit,
    artist: metadata?.artist_name ?? "Unknown artist",
    medium: "Video Art" as ArtMedium,
    assetUrl,
    mediaType: inferMediaType(imageField),
    edition: metadata?.edition,
    duration_or_dimensions: metadata?.duration_or_dimensions,
    units: [assetUnit],
  }
}

const GalleryAssetCard = ({
  asset,
  modelViewerReady,
}: {
  asset: AssetPreview
  modelViewerReady: boolean
}) => {
  const isVideo = asset.mediaType?.startsWith("video/")
  const isModel =
    asset.mediaType?.includes("model") ||
    asset.assetUrl?.toLowerCase().endsWith(".glb") ||
    asset.assetUrl?.toLowerCase().endsWith(".gltf")

  const handleVideoHover = (action: "enter" | "leave", element: HTMLVideoElement | null) => {
    if (!element) return
    if (action === "enter") {
      element.currentTime = 0
      element.play().catch(() => null)
    } else {
      element.pause()
      element.currentTime = 0
    }
  }

  const targetUnit = asset.units && asset.units.length > 0 ? asset.units[0] : asset.assetId

  return (
    <Link
      href={`/certificate/${targetUnit}`}
      className="group rounded-[20px] border border-as-border bg-as-surface/70 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-as-borderStrong/60 relative"
    >
      {asset.units && (
        <div className="absolute right-3 top-3 rounded-full bg-as-highlight px-3 py-1 text-[0.65rem] font-semibold text-as-heading">
          {asset.units.length} {asset.units.length === 1 ? 'unit' : 'units'}
        </div>
      )}
      <div className="relative aspect-square w-full overflow-hidden rounded-[16px] border border-as-border bg-as-highlight/20">
        {isVideo && asset.assetUrl ? (
          <video
            src={asset.assetUrl}
            muted
            loop
            playsInline
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onMouseEnter={(event) => handleVideoHover("enter", event.currentTarget)}
            onMouseLeave={(event) => handleVideoHover("leave", event.currentTarget)}
            onFocus={(event) => handleVideoHover("enter", event.currentTarget)}
            onBlur={(event) => handleVideoHover("leave", event.currentTarget)}
          />
        ) : isModel && asset.assetUrl && modelViewerReady ? (
          <model-viewer
            src={asset.assetUrl}
            autoplay
            ar
            {...({ "camera-controls": true, "disable-zoom": true } as Record<string, any>)}
            style={{ height: "100%", width: "100%", background: "rgba(255,255,255,0.02)" }}
          />
        ) : asset.assetUrl ? (
          <img
            src={asset.assetUrl}
            alt={asset.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-as-muted">
            <ImageOff size={32} />
          </div>
        )}
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-sm font-semibold text-as-heading">{asset.title}</p>
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-as-muted">{asset.artist}</p>
        <p className="text-[0.6rem] uppercase tracking-[0.25em] text-as-muted/70">
          {asset.medium}
          {asset.edition ? ` - ${asset.edition}` : ""}
        </p>
        {asset.duration_or_dimensions && (
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-as-muted/50">
            {asset.duration_or_dimensions}
          </p>
        )}
        <p className="break-all text-[0.6rem] font-mono uppercase tracking-[0.25em] text-as-muted/70">
          {asset.assetId}
        </p>
        {/* make total units explicit for UX */}
        <p className="mt-1 text-[0.65rem] text-as-muted/60">Total units: <span className="font-semibold">{asset.units ? asset.units.length : 1}</span></p>
      </div>
    </Link>
  )
}

export const NFTGallery = () => {
  const { account } = useLucid()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assets, setAssets] = useState<AssetPreview[]>([])
  const [modelViewerReady, setModelViewerReady] = useState(false)

  const blockfrostBase = useMemo(
    () =>
      (process.env.NEXT_PUBLIC_BLOCKFROST_API_URL ?? "https://cardano-preprod.blockfrost.io/api/v0")
        .replace(/\/$/, ""),
    []
  )

  useEffect(() => {
    loadModelViewer()
      .then(() => setModelViewerReady(true))
      .catch(() => setModelViewerReady(false))
  }, [])

  useEffect(() => {
    const loadArtPieces = async () => {
      if (!account?.address) {
        setAssets([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const assetListUrl = `${BLOCKFROST_PROXY_BASE}/addresses/${encodeURIComponent(
          account.address
        )}/assets?base=${encodeURIComponent(blockfrostBase)}`

        let walletAssets: Array<{ unit: string }> | null = null
        try {
          const response = await fetchFromBlockfrost(assetListUrl)
          if (Array.isArray(response)) {
            walletAssets = response.map((item) => ({ unit: item.unit as string }))
          }
        } catch (err) {
          console.warn("Primary asset list fetch failed; falling back to UTXO scan.", err)
        }

        if (!walletAssets) {
          walletAssets = await fetchAssetUnitsForAddress(account.address, blockfrostBase)
        }

        const assetUnits = Array.isArray(walletAssets) ? walletAssets : []
        const previews: AssetPreview[] = []

        for (const asset of assetUnits) {
          const detailUrl = `${BLOCKFROST_PROXY_BASE}/assets/${asset.unit}?base=${encodeURIComponent(
            blockfrostBase
          )}`
          const detail = await fetchFromBlockfrost(detailUrl)
          if (!detail) continue
          const preview = toPreview(asset.unit, detail)
          if (!preview) continue

          const assetUrl =
            preview.assetUrl ??
            ipfsToGateway(
              (detail.onchain_metadata?.image as string | undefined) ??
                (Array.isArray(detail.onchain_metadata?.files) && detail.onchain_metadata.files.length > 0
                  ? detail.onchain_metadata.files[0]?.src
                  : undefined)
            )

          previews.push({
            ...preview,
            assetUrl,
            mediaType: inferMediaType(assetUrl, preview.mediaType),
          })
        }

        // Group previews by policyId + base title to collapse fractional/multi-unit sets
        const groups = new Map<string, AssetPreview>()
        const POLICY_ID_LEN = 56
        const tryDecodeHex = (hex: string) => {
          try {
            if (!hex) return ''
            // if odd length, pad
            if (hex.length % 2 === 1) hex = '0' + hex
            const bytes = hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
            return String.fromCharCode(...bytes)
          } catch (e) {
            return ''
          }
        }

        for (const p of previews) {
          // derive policyId and asset name from assetId unit string when possible
          const unit = p.assetId
          const policyId = unit.slice(0, POLICY_ID_LEN)
          const nameHex = unit.slice(POLICY_ID_LEN) || ''
          let decoded = tryDecodeHex(nameHex)
          if (!decoded) decoded = p.title || ''
          // strip trailing _<index> if present
          const baseName = decoded.replace(/_\d+$/, '')
          const key = `${policyId}|${baseName}|${p.title}`

          if (!groups.has(key)) {
            groups.set(key, { ...p, units: p.units ? [...p.units] : [p.assetId] })
          } else {
            const existing = groups.get(key)!
            existing.units = Array.from(new Set([...(existing.units || []), ...(p.units || [p.assetId])]))
          }
        }

        setAssets(Array.from(groups.values()))
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "Unable to load art pieces")
      } finally {
        setIsLoading(false)
      }
    }

    loadArtPieces()
  }, [account?.address, blockfrostBase])

  if (!account) {
    return (
      <div className="rounded-[18px] border border-as-border bg-as-highlight/20 p-6 text-sm text-as-muted">
        Connect a wallet to surface your Arti collection.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-[18px] border border-as-border bg-as-highlight/20 p-6 text-sm text-as-muted">
        <Loader2 className="h-5 w-5 animate-spin text-as-heading" />
        Curation in progress...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[18px] border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
        {error}
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div className="rounded-[18px] border border-as-border bg-as-highlight/20 p-6 text-sm text-as-muted">
        No Arti tokens detected for this wallet yet. Mint or collect a piece to see it appear here.
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {assets.map((asset) => (
        <GalleryAssetCard key={asset.assetId} asset={asset} modelViewerReady={modelViewerReady} />
      ))}
    </div>
  )
}








