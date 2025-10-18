import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { CertificatePreview } from "../../components/CertificatePreview"
import { useLucid } from "../../contexts/LucidContext"
import { mintArtPieceToken } from "../../lib/minting-utils"
import {
  ArtiCip721Metadata,
  ArtMedium,
  ArtPieceFormValues,
  ArtPieceMetadata,
} from "../../types/passport"

const mediumOptions: ArtMedium[] = ["3D Animation", "Video Art", "Generative Art"]

const initialForm: ArtPieceFormValues = {
  title: "",
  artist_name: "",
  description: "",
  medium: "",
  edition: "",
  duration_or_dimensions: "",
}

const steps = ["Story", "Details", "Asset"]

export default function MintPage() {
  const router = useRouter()
  const { lucid, account } = useLucid()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<ArtPieceFormValues>(initialForm)
  const [assetFile, setAssetFile] = useState<File | null>(null)
  const [assetFileName, setAssetFileName] = useState("")
  const [assetPreviewUrl, setAssetPreviewUrl] = useState<string | null>(null)
  const [assetFileType, setAssetFileType] = useState<string | undefined>(undefined)
  const [isMinting, setIsMinting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const canProceed = useMemo(() => {
    if (step === 0) {
      return Boolean(form.title.trim() && form.artist_name.trim() && form.description.trim())
    }

    if (step === 1) {
      return Boolean(form.medium)
    }

    if (step === 2) {
      return Boolean(assetFile)
    }

    return true
  }, [step, form, assetFile])

  const handleInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAsset = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (assetPreviewUrl) {
      URL.revokeObjectURL(assetPreviewUrl)
    }

    const previewUrl = file.type.startsWith("video/") ? URL.createObjectURL(file) : null

    setAssetFile(file)
    setAssetFileName(file.name)
    setAssetFileType(file.type || undefined)
    setAssetPreviewUrl(previewUrl)
  }

  useEffect(() => {
    return () => {
      if (assetPreviewUrl) {
        URL.revokeObjectURL(assetPreviewUrl)
      }
    }
  }, [assetPreviewUrl])

  const goNext = () => {
    if (step < steps.length - 1 && canProceed) {
      setStep((prev) => prev + 1)
      setError(null)
    }
  }

  const goBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1)
    }
  }

  const buildArtPieceMetadata = (assetCid: string): ArtPieceMetadata => ({
    title: form.title,
    artist_name: form.artist_name,
    description: form.description,
    medium: form.medium as ArtMedium,
    file_url: `ipfs://${assetCid}`,
    edition: form.edition.trim() ? form.edition.trim() : undefined,
    duration_or_dimensions: form.duration_or_dimensions.trim()
      ? form.duration_or_dimensions.trim()
      : undefined,
  })

  const handleMint = async (event: FormEvent) => {
    event.preventDefault()

    if (!lucid || !account?.address) {
      setError("Connect a supported Cardano wallet before minting.")
      return
    }

    if (!assetFile) {
      setError("Upload the primary media asset before minting.")
      return
    }

    try {
      setIsMinting(true)
      setError(null)
      setStatus("Uploading media to IPFS...")

      const body = new FormData()
      body.append("asset", assetFile)
      body.append("title", form.title)
      body.append("artist_name", form.artist_name)
      body.append("description", form.description)
      body.append("medium", form.medium)
      body.append("edition", form.edition)
      body.append("duration_or_dimensions", form.duration_or_dimensions)

      const uploadResponse = await fetch("/api/mint-asset", {
        method: "POST",
        body,
      })

      if (!uploadResponse.ok) {
        const message = await uploadResponse.json().catch(() => ({ error: uploadResponse.statusText }))
        throw new Error(message.error || "Failed to upload media to IPFS")
      }

      const { asset, metadata, mediaType } = (await uploadResponse.json()) as {
        asset: string
        metadata: string
        mediaType: string
      }

      if (!asset || !metadata) {
        throw new Error("Upload API did not return valid IPFS hashes")
      }

      setStatus("Finalising your Arti token on Cardano...")

      const artPiece = buildArtPieceMetadata(asset)
      const cipMetadata: ArtiCip721Metadata = {
        name: `Arti Showcase - ${form.title}`,
        description: `${form.title} by ${form.artist_name}`,
        image: `ipfs://${asset}`,
        files: [
          {
            name: form.title,
            mediaType,
            src: `ipfs://${asset}`,
          },
          {
            name: "Arti Metadata",
            mediaType: "application/json",
            src: `ipfs://${metadata}`,
          },
        ],
        art_piece: artPiece,
      }

      const { txHash, unit } = await mintArtPieceToken({
        lucid,
        address: account.address,
        name: form.title,
        cipMetadata,
      })

      const query = new URLSearchParams({ tx: txHash, asset: unit })
      query.set("title", form.title)
      query.set("medium", form.medium)

      setStatus(null)
      router.push(`/mint/success?${query.toString()}`)
    } catch (err) {
      console.error("Mint failed", err)
      setError(err instanceof Error ? err.message : "Failed to mint artwork token")
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pt-10">
      <section className="pixel-card overflow-hidden px-8 py-10">
        <div className="flex flex-col gap-4 text-center lg:text-left">
          <span className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-as-borderStrong/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-as-muted lg:self-start">
            Arti Minting Console
          </span>
          <h1 className="text-4xl font-semibold text-as-heading sm:text-5xl">
            Tokenise your cinematic masterpiece.
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-as-muted lg:mx-0">
            Document the narrative and release details behind your premium artwork, then anchor the
            finished piece as a one-of-one token on Cardano.
          </p>
        </div>
      </section>

      <div className="flex items-center justify-center gap-3">
        {steps.map((label, index) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-2">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold uppercase tracking-[0.25em] transition-all duration-200 ${
                  index === step
                    ? "border-as-borderStrong bg-as-highlight text-as-heading"
                    : index < step
                    ? "border-green-400 bg-green-500/20 text-green-200"
                    : "border-as-border bg-as-background text-as-muted"
                }`}
              >
                {index < step ? "DONE" : index + 1}
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-as-muted">{label}</span>
            </div>
            {index < steps.length - 1 && (
              <span className="hidden h-px w-10 bg-gradient-to-r from-as-borderStrong/20 to-transparent sm:block" />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleMint} className="space-y-8">
        {step === 0 && (
          <section className="pixel-card px-8 py-10">
            <header className="mb-8 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-as-muted">
                Step 1 - Story
              </p>
              <h2 className="text-2xl font-semibold text-as-heading">Introduce the artwork</h2>
            </header>

            <div className="grid gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-as-muted">
                  Title
                </span>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInput}
                  className="pixel-input"
                  placeholder="e.g. Neon Reverie"
                  required
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-as-muted">
                  Artist name
                </span>
                <input
                  type="text"
                  name="artist_name"
                  value={form.artist_name}
                  onChange={handleInput}
                  className="pixel-input"
                  placeholder="Studio or creator signature"
                  required
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-as-muted">
                  Curatorial statement
                </span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInput}
                  className="pixel-input min-h-[160px]"
                  placeholder="Capture the concept, inspiration, and techniques behind the piece."
                  required
                />
              </label>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="pixel-card px-8 py-10">
            <header className="mb-8 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-as-muted">
                Step 2 - Details
              </p>
              <h2 className="text-2xl font-semibold text-as-heading">Edition & medium</h2>
            </header>

            <div className="grid gap-6">
              <fieldset className="flex flex-col gap-4">
                <legend className="text-sm font-semibold uppercase tracking-[0.3em] text-as-muted">
                  Select medium
                </legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {mediumOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, medium: option }))}
                      className={`rounded-2xl border px-4 py-5 text-sm uppercase tracking-[0.25em] transition ${
                        form.medium === option
                          ? "border-as-borderStrong bg-as-highlight text-as-heading"
                          : "border-as-border bg-as-background text-as-muted hover:border-as-borderStrong/70"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-as-muted">
                  Edition label (optional)
                </span>
                <input
                  type="text"
                  name="edition"
                  value={form.edition}
                  onChange={handleInput}
                  className="pixel-input"
                  placeholder='e.g. "1 of 1" or "Artist Proof"'
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-as-muted">
                  Duration or dimensions (optional)
                </span>
                <input
                  type="text"
                  name="duration_or_dimensions"
                  value={form.duration_or_dimensions}
                  onChange={handleInput}
                  className="pixel-input"
                  placeholder='e.g. "03:12" or "3840x2160"'
                />
              </label>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="pixel-card px-8 py-10">
            <header className="mb-8 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-as-muted">
                Step 3 - Asset
              </p>
              <h2 className="text-2xl font-semibold text-as-heading">Upload the master file</h2>
            </header>

            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
              <div className="space-y-6">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-as-muted">
                    Primary media
                  </span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,model/gltf-binary,model/gltf+json"
                    onChange={handleAsset}
                    className="pixel-input file:mr-3 file:rounded-full file:border-0 file:bg-as-highlight file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.35em] file:text-as-heading hover:file:bg-as-highlight/60"
                  />
                  <span className="text-xs uppercase tracking-[0.25em] text-as-muted">
                    MP4, WebM, GLB, or GLTF - 250MB max
                  </span>
                  {assetFileName && (
                    <span className="text-xs uppercase tracking-[0.25em] text-as-muted">
                      {assetFileName}
                    </span>
                  )}
                  {assetPreviewUrl && assetFileType?.startsWith("video/") && (
                    <video
                      controls
                      className="mt-4 w-full rounded-2xl border border-as-border bg-as-background/80"
                    >
                      <source src={assetPreviewUrl} type={assetFileType} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {assetFileType && assetFileType.includes("model") && (
                    <div className="mt-4 rounded-2xl border border-as-border bg-as-highlight/20 p-4 text-xs uppercase tracking-[0.25em] text-as-muted">
                      3D assets will be rendered via &lt;model-viewer&gt; in the gallery.
                    </div>
                  )}
                </label>
              </div>

              <CertificatePreview
                formData={form}
                assetFileName={assetFileName}
                assetPreviewUrl={assetPreviewUrl}
                assetFileType={assetFileType}
              />
            </div>

            <div className="mt-8 rounded-2xl border border-as-border bg-as-highlight/30 p-5 text-sm leading-relaxed text-as-muted">
              Review every field carefully. Once minted, the token&apos;s metadata is permanent.
            </div>
          </section>
        )}

        <div aria-live="polite" className="space-y-4">
          {error && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}
          {status && !error && (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-as-border bg-as-highlight/20 p-4 text-sm text-as-muted">
              <div className="h-5 w-5 animate-spin rounded-full border border-as-border border-t-transparent" />
              <span>{status}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0 || isMinting}
            className="pixel-btn px-6 py-3 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed || isMinting}
              className="pixel-btn pixel-btn--secondary px-6 py-3 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canProceed || isMinting}
              className="pixel-btn pixel-btn--primary px-8 py-3 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isMinting ? "Minting..." : "Mint Art Piece"}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
