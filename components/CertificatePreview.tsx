import { ArtPieceFormValues } from "../types/passport"

type CertificatePreviewProps = {
  formData: ArtPieceFormValues
  assetFileName: string
  assetPreviewUrl?: string | null
  assetFileType?: string
}

export const CertificatePreview = ({
  formData,
  assetFileName,
  assetPreviewUrl,
  assetFileType,
}: CertificatePreviewProps) => {
  const isVideo = assetFileType?.startsWith("video/")
  const isModel = assetFileType?.includes("model")

  return (
    <article className="pixel-card flex flex-col overflow-hidden">
      <div className="relative">
        <div className="aspect-square w-full bg-as-highlight/20">
          {isVideo && assetPreviewUrl ? (
            <video
              src={assetPreviewUrl}
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : isModel ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-as-background/60 text-center text-xs uppercase tracking-[0.35em] text-as-muted">
              <span>3D asset ready</span>
              <span>Preview available after mint</span>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-as-background text-as-muted">
              <span className="text-xs uppercase tracking-[0.35em]">Thumbnail pending</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-4 left-4 rounded-full border border-as-border bg-as-background/80 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-as-muted backdrop-blur">
          Arti Preview
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-6">
        <header className="space-y-2">
          <h3 className="text-2xl font-semibold text-as-heading">
            {formData.title || "Untitled Artwork"}
          </h3>
          <p className="text-sm uppercase tracking-[0.35em] text-as-muted">
            {formData.artist_name || "Artist TBD"}
          </p>
        </header>

        <section className="space-y-3 text-sm leading-relaxed text-as-muted">
          <p>{formData.description || "Awaiting curatorial statement."}</p>
        </section>

        <dl className="grid grid-cols-1 gap-3 text-xs uppercase tracking-[0.25em] text-as-muted sm:grid-cols-2">
          <div className="rounded-2xl border border-as-border bg-as-highlight/20 p-4">
            <dt className="text-[0.6rem] text-as-muted">Medium</dt>
            <dd className="mt-2 text-as-heading">
              {formData.medium || "-"}
            </dd>
          </div>
          <div className="rounded-2xl border border-as-border bg-as-highlight/20 p-4">
            <dt className="text-[0.6rem] text-as-muted">Dimensions</dt>
            <dd className="mt-2 text-as-heading">
              {formData.duration_or_dimensions || "-"}
            </dd>
          </div>
          <div className="rounded-2xl border border-as-border bg-as-highlight/20 p-4">
            <dt className="text-[0.6rem] text-as-muted">Digital asset</dt>
            <dd className="mt-2 text-as-heading">
              {assetFileType || "-"}
            </dd>
          </div>
          <div className="rounded-2xl border border-as-border bg-as-highlight/20 p-4">
            <dt className="text-[0.6rem] text-as-muted">Edition</dt>
            <dd className="mt-2 text-as-heading">{formData.edition || "Single release"}</dd>
          </div>
        </dl>

        {assetPreviewUrl && isVideo && (
          <video
            controls
            className="rounded-2xl border border-as-border bg-as-background/80"
          >
            <source src={assetPreviewUrl} type={assetFileType} />
            Your browser does not support the video tag.
          </video>
        )}

        {assetPreviewUrl && !isVideo && isModel && (
          <div className="rounded-2xl border border-as-border bg-as-highlight/20 p-4 text-xs uppercase tracking-[0.25em] text-as-muted">
            3D assets will be available as downloads after minting.
          </div>
        )}

        <footer className="mt-auto space-y-2 rounded-2xl border border-as-border bg-as-highlight/10 p-4">
          <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.35em] text-as-muted">
            <span>High-res token</span>
            <span>{assetFileName || "No asset attached"}</span>
          </div>
          <div className="text-[0.6rem] uppercase tracking-[0.35em] text-as-muted">
            Platform - Arti Showcase
          </div>
        </footer>
      </div>
    </article>
  )
}
