import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Loader2 } from "lucide-react"
import { ArtMedium, ArtPieceMetadata } from "../../types/passport"
import { ipfsToGateway } from "../../utils/ipfs"

const explorerBase =
  process.env.NEXT_PUBLIC_EXPLORER_ASSET_URL ?? "https://preprod.cexplorer.io/asset/"

const BLOCKFROST_PROXY_BASE = "/api/blockfrost"

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

const fetchAssetCertificate = async (
  assetUnit: string,
  blockfrostBase: string
): Promise<CertificateRecord | null> => {
  const url = `${BLOCKFROST_PROXY_BASE}/assets/${assetUnit}?base=${encodeURIComponent(
    blockfrostBase
  )}`
  const response = await fetch(url)

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(`Failed to load asset ${assetUnit}`)
  }

  const detail = await response.json()
  const metadata = detail.onchain_metadata ?? {}
  const files: Array<{ mediaType?: string; src?: string }> = Array.isArray(metadata?.files)
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
      artPiece,
      title: artPiece.title,
      artist: artPiece.artist_name,
      description: artPiece.description,
      medium: artPiece.medium,
      assetUrl,
      mediaType: inferMediaType(assetUrl, primaryFile?.mediaType),
      edition: artPiece.edition,
      duration_or_dimensions: artPiece.duration_or_dimensions,
    }
  }

  const certificate = metadata?.certificate as
    | {
        core_data?: { title?: string; artist_name?: string; description?: string; thumbnail_url?: string }
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
      description: certificate.core_data.description,
      medium: "Video Art" as ArtMedium,
      assetUrl,
      mediaType: inferMediaType(assetUrl, certificate.digital_asset.file_type),
      edition: undefined,
      duration_or_dimensions: undefined,
    }
  }

  const imageField = metadata?.image as string | undefined
  const assetUrl =
    ipfsToGateway(imageField) ??
    ipfsToGateway(files.find((file) => file.src)?.src ?? undefined) ??
    null
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
  }
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

export default function CertificateDetailPage() {
  const router = useRouter()
  const { unit } = router.query

  const [record, setRecord] = useState<CertificateRecord | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [modelViewerReady, setModelViewerReady] = useState(false)

  const assetUnit = useMemo(() => {
    if (!unit) return null
    return Array.isArray(unit) ? unit[0] : unit
  }, [unit])
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
    const loadCertificate = async () => {
      if (!assetUnit) return

      setIsLoading(true)
      setError(null)

      try {
        const result = await fetchAssetCertificate(assetUnit, blockfrostBase)
        if (!result) {
          setError("This asset does not follow the Arti metadata standard.")
          setRecord(null)
        } else {
          setRecord(result)
        }
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "Failed to load art metadata")
      } finally {
        setIsLoading(false)
      }
    }

    loadCertificate()
  }, [assetUnit, blockfrostBase])

  if (!assetUnit) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-16 text-as-muted">
        <Loader2 className="h-6 w-6 animate-spin" />
        Retrieving art piece...
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl rounded-[18px] border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
        {error}
      </div>
    )
  }

  if (!record) {
    return null
  }

  const assetUrl = record.assetUrl
  const isVideoAsset = record.mediaType?.startsWith("video/")
  const isModelAsset =
    record.mediaType?.includes("model") ||
    assetUrl?.toLowerCase()?.endsWith(".glb") ||
    assetUrl?.toLowerCase()?.endsWith(".gltf")

  return (
    <div className="mx-auto max-w-5xl space-y-10 pt-10 text-as-body">
      <header className="flex flex-col gap-4 text-left sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-as-muted">Arti Registry</p>
          <h1 className="text-4xl font-semibold text-as-heading">{record.title}</h1>
          <p className="text-sm uppercase tracking-[0.35em] text-as-muted">{record.artist}</p>
        </div>
        <Link href="/my-passports" className="pixel-btn px-6 py-3 text-[0.65rem]">
          Back to collection
        </Link>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <article className="pixel-card overflow-hidden">
          <div className="relative aspect-square w-full bg-as-highlight/20">
            {isVideoAsset && assetUrl ? (
              <video
                controls
                playsInline
                className="h-full w-full object-cover"
                muted
                loop
                src={assetUrl}
              />
            ) : isModelAsset && assetUrl && modelViewerReady ? (
              <model-viewer
                src={assetUrl}
                autoplay
                ar
                {...({ "camera-controls": true, "disable-zoom": true } as Record<string, any>)}
                style={{ height: "100%", width: "100%", background: "rgba(255,255,255,0.02)" }}
              />
            ) : assetUrl ? (
              <img src={assetUrl} alt={record.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-as-muted">
                No media preview available
              </div>
            )}
          </div>
          <div className="space-y-4 p-6 text-sm leading-relaxed text-as-muted">
            <p>{record.description ?? "No description provided."}</p>
          </div>
        </article>

        <aside className="pixel-card space-y-6 p-6 text-sm text-as-muted">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-as-muted/70">Asset unit</p>
            <p className="mt-2 break-all font-mono text-[0.7rem] uppercase tracking-[0.25em] text-as-heading">
              {record.assetId}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-as-muted/70">Medium</p>
              <p className="mt-2 text-as-heading">{record.medium}</p>
            </div>
            {!!record.edition && (
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-as-muted/70">Edition</p>
                <p className="mt-2 text-as-heading">{record.edition}</p>
              </div>
            )}
          </div>

          {record.duration_or_dimensions && (
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-as-muted/70">
                Duration / Dimensions
              </p>
              <p className="mt-2 text-as-heading">{record.duration_or_dimensions}</p>
            </div>
          )}

          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-as-muted/70">Media type</p>
            <p className="mt-2 text-as-heading">{record.mediaType ?? "Unspecified"}</p>
          </div>

          <Link
            href={`${explorerBase}${record.assetId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-btn pixel-btn--primary inline-flex items-center justify-center px-6 py-3 text-[0.65rem]"
          >
            View on Cardano explorer
          </Link>
        </aside>
      </section>
    </div>
  )
}
