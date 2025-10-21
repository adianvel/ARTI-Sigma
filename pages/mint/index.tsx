import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { CertificatePreview } from "../../components/CertificatePreview"
import { useLucid } from "../../contexts/LucidContext"
import { mintArtPieceToken, mintFractionalPieces, mintFractionalInBatches } from "../../lib/minting-utils"
import PassportPreviewModal from "../../components/PassportPreviewModal"
import { useDevError } from '../../contexts/DevErrorContext'
import {
  ArtiCip721Metadata,
  ArtMedium,
  ArtPieceFormValues,
  ArtPieceMetadata,
  ArtworksIDPassport,
} from "../../types/passport"

const mediumOptions: ArtMedium[] = ["3D Animation", "Video Art", "Generative Art"]

const initialForm: ArtPieceFormValues = {
  title: "",
  artist_name: "",
  description: "",
  medium: "",
  edition: "",
  duration_or_dimensions: "",
  designed_color: "",
  royalties_percentage: 5,
  license_type: "All Rights Reserved",
  // fractional defaults
  total_units: 27,
  sale_type: 'direct',
  price_per_unit_idr: 0,
  partner_share_percent: 0,
}

const steps = ["Story", "Details", "Asset"]

export default function MintPage() {
  const router = useRouter()
  const { lucid, account } = useLucid()
  const devError = useDevError()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<ArtPieceFormValues>(initialForm)
  const [assetFile, setAssetFile] = useState<File | null>(null)
  const [assetFileName, setAssetFileName] = useState("")
  const [assetPreviewUrl, setAssetPreviewUrl] = useState<string | null>(null)
  const [assetFileType, setAssetFileType] = useState<string | undefined>(undefined)
  const [isMinting, setIsMinting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [showPassportPreview, setShowPassportPreview] = useState(false)
  const [pendingPassport, setPendingPassport] = useState<ArtworksIDPassport | null>(null)
  const [pendingFractional, setPendingFractional] = useState<any | null>(null)
  const [uploadedAssetCid, setUploadedAssetCid] = useState<string | null>(null)
  const [uploadedMetadataCid, setUploadedMetadataCid] = useState<string | null>(null)
  const [uploadedMediaType, setUploadedMediaType] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<{ designed_color?: string; royalties_percentage?: string }>({})
  const [savedDefaultMsg, setSavedDefaultMsg] = useState<string | null>(null)
  const [apiEstimate, setApiEstimate] = useState<{
    sizeMB: number
    pinCostAda: number
    mintFeeAda: number
    estimatedTotalAda: number
  } | null>(null)

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
    // clear relevant error when user edits
    if (name === 'designed_color') setFormErrors((prev) => ({ ...prev, designed_color: undefined }))
    if (name === 'license_type') setFormErrors((prev) => ({ ...prev, license_type: undefined }))
  }

  // Load default royalty from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('arti:defaultRoyalty')
      if (raw) {
        const val = Number(raw)
        if (!Number.isNaN(val)) {
          setForm((prev) => ({ ...prev, royalties_percentage: val }))
        }
      }
    } catch (err) {
      // ignore localStorage errors
    }
  }, [])

  // Fetch server-side defaults when wallet address is available
  useEffect(() => {
    if (!account?.address) return
    const fetchDefaults = async () => {
      try {
        const resp = await fetch(`/api/user-defaults?address=${encodeURIComponent(account.address)}`)
        if (!resp.ok) return
        const json = await resp.json()
        if (json?.defaults) {
          const d = json.defaults as { royalties_percentage?: number; license_type?: string }
          setForm((prev) => ({ ...prev, royalties_percentage: d.royalties_percentage ?? prev.royalties_percentage, license_type: d.license_type ?? prev.license_type }))
        }
      } catch (err) {
        // ignore
      }
    }
    fetchDefaults()
  }, [account?.address])

  const saveDefaultRoyalty = () => {
    const val = form.royalties_percentage ?? 5
    // Try to save server-side if we have an address
    if (account?.address) {
      fetch('/api/user-defaults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: account.address, defaults: { royalties_percentage: val, license_type: form.license_type } }),
      })
        .then((r) => r.ok && r.json())
        .then(() => {
          try {
            localStorage.setItem('arti:defaultRoyalty', String(val))
          } catch (_) {}
          setSavedDefaultMsg('Default saved to server')
          setTimeout(() => setSavedDefaultMsg(null), 2500)
        })
        .catch(() => {
          try {
            localStorage.setItem('arti:defaultRoyalty', String(val))
          } catch (_) {}
          setSavedDefaultMsg('Saved locally (server failed)')
          setTimeout(() => setSavedDefaultMsg(null), 2500)
        })
      return
    }

    // Fallback to localStorage when no address
    try {
      localStorage.setItem('arti:defaultRoyalty', String(val))
      setSavedDefaultMsg('Default royalty saved locally')
      setTimeout(() => setSavedDefaultMsg(null), 2500)
    } catch (err) {
      setSavedDefaultMsg('Failed to save default')
      setTimeout(() => setSavedDefaultMsg(null), 2500)
    }
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

    // Fetch server-side estimate when file chosen
    try {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const resp = await fetch('/api/estimate-fees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sizeBytes: file.size, royaltyPercent: form.royalties_percentage ?? 5, totalUnits: form.total_units ?? 1 }),
          })
          if (resp.ok) {
            const json = await resp.json()
            setApiEstimate(json)
          } else {
            const payload = await resp.json().catch(() => ({ error: resp.statusText }))
            // show dev modal if stack present
            if (payload?.stack) devError.show(payload)
            setApiEstimate(null)
          }
        } catch (err) {
          setApiEstimate(null)
        }
      }
      // trigger onload; we don't need the dataURL itself, just trigger flow
      reader.readAsArrayBuffer(file)
    } catch (err) {
      setApiEstimate(null)
    }
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

      // Build the new ArtworksIDPassport structure and open preview modal
      const registeredNumber = `ARTI-${Date.now()}`
      const artsDesigned: 'unique' | 'masses' = (form.edition || '').toLowerCase().includes('1 of 1') ? 'unique' : 'masses'

      // Validate designed_color (allow any non-empty string or hex) and royalties range
      const errors: { designed_color?: string; royalties_percentage?: string } = {}
      const color = form.designed_color?.trim()
      if (color && !/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color) && color.length > 30) {
        errors.designed_color = 'Warna tidak dikenali. Gunakan hex (#RRGGBB) atau nama singkat.'
      }
      const roy = form.royalties_percentage ?? 5
      if (Number.isNaN(Number(roy)) || roy < 0 || roy > 100) {
        errors.royalties_percentage = 'Royalti harus antara 0 dan 100.'
      }
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        setIsMinting(false)
        return
      }

      const passport: ArtworksIDPassport = {
        identity: {
          artworks_name: form.title,
          date_of_released: new Date().toISOString(),
        },
        attributes: {
          type: form.medium as string,
          designed_color: form.designed_color ?? '',
          arts_designed: artsDesigned,
        },
        unique_identification: {
          registered_number: registeredNumber,
        },
        provenance: {
          designer_name: form.artist_name,
        },
        platform_info: {
          image_url: `ipfs://${asset}`,
          validation_tier: "Level 1 - Self Attested",
          minted_on: new Date().toISOString(),
          application_version: "1.0",
          royalties: {
            percentage: form.royalties_percentage ?? 5,
            recipient_wallet: account.address,
            enforcement_standard: "CIP-27",
          },
          copyright: {
            owner_name: form.artist_name,
            license_type: form.license_type ?? "All Rights Reserved",
            disclaimer: "Artwork metadata and ownership recorded on Cardano.",
          },
        },
      }

      // Build fractional payload separately (not embedded in passport per SRS)
      const fractionalPayload = {
        total_units: form.total_units ?? 27,
        sale_type: form.sale_type,
        price_primary_idr: form.price_per_unit_idr,
        partner_share_percent: form.partner_share_percent,
        master_asset_ipfs: metadata ? `ipfs://${metadata}` : undefined,
      }

  // Save uploaded IPFS details for use when user confirms
  setUploadedAssetCid(asset)
  setUploadedMetadataCid(metadata)
  setUploadedMediaType(mediaType)

  setPendingPassport(passport)
  setPendingFractional(fractionalPayload)
  setShowPassportPreview(true)
    } catch (err) {
      console.error("Mint failed", err)
      setError(err instanceof Error ? err.message : "Failed to mint artwork token")
    } finally {
      setIsMinting(false)
    }
  }

  const confirmAndMint = async () => {
    if (!pendingPassport || !uploadedAssetCid || !uploadedMetadataCid || !uploadedMediaType) return
    try {
      setIsMinting(true)
      setShowPassportPreview(false)
      setStatus("Pinning passport metadata to IPFS...")

      const pinResponse = await fetch("/api/pin-passport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingPassport),
      })

      if (!pinResponse.ok) {
        const message = await pinResponse.json().catch(() => ({ error: pinResponse.statusText }))
        throw new Error(message.error || "Failed to pin passport to IPFS")
      }

      const { ipfsHash } = (await pinResponse.json()) as { ipfsHash: string }

      // If we have fractional data, pin it separately
      let fractionalIpfs: string | null = null
      if (pendingFractional) {
        const pinFrac = await fetch('/api/pin-passport', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pendingFractional),
        })
        if (!pinFrac.ok) {
          const message = await pinFrac.json().catch(() => ({ error: pinFrac.statusText }))
          throw new Error(message.error || 'Failed to pin fractional payload to IPFS')
        }
        const { ipfsHash: fracHash } = (await pinFrac.json()) as { ipfsHash: string }
        fractionalIpfs = fracHash
      }

      // Build a CIP-721 compatible metadata object that references the passport JSON
      const cipMetadata: ArtiCip721Metadata = {
        name: `Arti Showcase - ${pendingPassport.identity.artworks_name}`,
        description: `${pendingPassport.identity.artworks_name} by ${pendingPassport.provenance?.designer_name ?? ''}`,
        image: `ipfs://${uploadedAssetCid}`,
        files: [
          { name: pendingPassport.identity.artworks_name, mediaType: uploadedMediaType, src: `ipfs://${uploadedAssetCid}` },
          { name: "Arti Metadata", mediaType: "application/json", src: `ipfs://${uploadedMetadataCid}` },
          { name: "ArtworksIDPassport", mediaType: "application/json", src: `ipfs://${ipfsHash}` },
          ...(fractionalIpfs ? [{ name: "FractionalInfo", mediaType: "application/json", src: `ipfs://${fractionalIpfs}` }] : []),
        ],
        art_piece: buildArtPieceMetadata(uploadedAssetCid),
      }

      // If fractional, choose batching strategy to avoid tx size limits
      const fractional = pendingFractional
      if (fractional && fractional.total_units && Number(fractional.total_units) > 1) {
        const totalUnits = Number(fractional.total_units)
        const perUnitTemplate = { ...cipMetadata }

        const BATCH_SIZE = 20
          if (totalUnits <= BATCH_SIZE) {
          // small enough to mint in a single tx
          const { txHash, units, policyId } = await mintFractionalPieces({
            lucid: lucid!,
            address: account!.address,
            baseName: pendingPassport.identity.artworks_name,
            cipMetadataTemplate: perUnitTemplate,
            totalUnits,
            masterAssetIpfs: `ipfs://${ipfsHash}`,
          })

          const query = new URLSearchParams({ tx: txHash, asset: units[0] })
          query.set("title", pendingPassport.identity.artworks_name)
          query.set("medium", pendingPassport.attributes.type)
          setStatus(null)
          router.push(`/mint/success?${query.toString()}`)
        } else {
          // Use batching to split into safe transactions
          const { txHashes, units, policyId } = await mintFractionalInBatches({
            lucid: lucid!,
            address: account!.address,
            baseName: pendingPassport.identity.artworks_name,
            cipMetadataTemplate: perUnitTemplate,
            totalUnits,
            batchSize: BATCH_SIZE,
            masterAssetIpfs: `ipfs://${ipfsHash}`,
          })

          // Redirect to success with first tx and summary (UI can show others)
          const query = new URLSearchParams({ tx: txHashes[0], asset: units[0] })
          query.set('title', pendingPassport.identity.artworks_name)
          query.set('medium', pendingPassport.attributes.type)
          query.set('tx_count', String(txHashes.length))

          setStatus(null)
          router.push(`/mint/success?${query.toString()}`)
        }
      } else {
        const { txHash, unit } = await mintArtPieceToken({
          lucid: lucid!,
          address: account!.address,
          name: pendingPassport.identity.artworks_name,
          cipMetadata,
        })

        const query = new URLSearchParams({ tx: txHash, asset: unit })
        query.set("title", pendingPassport.identity.artworks_name)
        query.set("medium", pendingPassport.attributes.type)

        setStatus(null)
        router.push(`/mint/success?${query.toString()}`)
      }
    } catch (err) {
      console.error("Confirm mint failed", err)
      setError(err instanceof Error ? err.message : "Failed to mint artwork token")
    } finally {
      setIsMinting(false)
    }
  }

  // Simple client-side pricing estimator (placeholder)
  const estimateCosts = (sizeBytes: number | null, royaltyPercent: number) => {
    const sizeMB = sizeBytes ? Math.max(1, Math.round(sizeBytes / 1024 / 1024)) : 0
    const pinPerMB = 0.002 // ADA per MB (placeholder)
    const pinCost = Number((sizeMB * pinPerMB).toFixed(6))
    const baseMintFee = 1.0 // ADA base mint fee (placeholder)
    const royaltyImpact = 0 // royalties don't change mint fee in this simple model
    const total = Number((pinCost + baseMintFee + royaltyImpact).toFixed(6))
    return { sizeMB, pinCost, baseMintFee, royaltyImpact, total }
  }

  const estimated = useMemo(() => {
    return estimateCosts(assetFile?.size ?? null, form.royalties_percentage ?? 5)
  }, [assetFile?.size, form.royalties_percentage])

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

              {/* Fractional minting controls */}
              <div className="grid gap-3">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-as-muted">Total units</span>
                  <input
                    type="number"
                    name="total_units"
                    value={String(form.total_units ?? 27)}
                    onChange={(e) => {
                      const v = Math.max(1, Number(e.target.value) || 1)
                      const capped = Math.min(100, v)
                      setForm((prev) => ({ ...prev, total_units: capped }))
                    }}
                    className="pixel-input"
                    min={1}
                    max={100}
                  />
                </label>

                <label className="flex items-center gap-3">
                  <input type="radio" name="sale_type" checked={form.sale_type === 'direct'} onChange={() => setForm((prev) => ({ ...prev, sale_type: 'direct' }))} />
                  <span className="text-sm text-as-muted">Direct Artist Sale</span>
                  <input type="radio" name="sale_type" checked={form.sale_type === 'partner'} onChange={() => setForm((prev) => ({ ...prev, sale_type: 'partner' }))} />
                  <span className="text-sm text-as-muted">Partner Sale</span>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-as-muted">Price per unit (IDR)</span>
                  <input
                    type="number"
                    name="price_per_unit_idr"
                    value={String(form.price_per_unit_idr ?? '')}
                    onChange={(e) => setForm((prev) => ({ ...prev, price_per_unit_idr: Number(e.target.value) }))}
                    className="pixel-input"
                    min={0}
                  />
                </label>

                {form.sale_type === 'partner' && (
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold uppercase tracking-[0.3em] text-as-muted">Partner share %</span>
                    <input
                      type="number"
                      name="partner_share_percent"
                      value={String(form.partner_share_percent ?? 0)}
                      onChange={(e) => setForm((prev) => ({ ...prev, partner_share_percent: Number(e.target.value) }))}
                      className="pixel-input"
                      min={0}
                      max={50}
                    />
                  </label>
                )}

                {/* Distribution preview */}
                <div className="rounded-2xl border border-as-border bg-as-background/30 p-4 text-xs text-as-muted">
                  <div className="font-semibold">Distribution preview</div>
                  {(() => {
                    const units = form.total_units ?? 27
                    const pricePerUnit = form.price_per_unit_idr ?? 0
                    const totalIdr = units * pricePerUnit
                    const artistShare = form.sale_type === 'partner' ? 0.15 : 0.30
                    const partnerShare = form.sale_type === 'partner' ? 0.15 : 0
                    const holdersShare = 0.70
                    const perHolder = (totalIdr * holdersShare) / units
                    return (
                      <div className="mt-2 grid gap-1">
                        <div>Total raise: Rp {totalIdr.toLocaleString()}</div>
                        <div>Artist: {Math.round((totalIdr * artistShare)).toLocaleString()} ({artistShare * 100}%)</div>
                        {form.sale_type === 'partner' && <div>Partner: {Math.round((totalIdr * partnerShare)).toLocaleString()} ({partnerShare * 100}%)</div>}
                        <div>NFT holders (total): {Math.round((totalIdr * holdersShare)).toLocaleString()} (~Rp {Math.round(perHolder).toLocaleString()} / unit)</div>
                      </div>
                    )
                  })()}
                </div>
              </div>

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

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-as-muted">
                  Designed color (optional)
                </span>
                <input
                  type="text"
                  name="designed_color"
                  value={form.designed_color}
                  onChange={handleInput}
                  className="pixel-input"
                  placeholder='e.g. "#00D9FF" or "Cyan Glow"'
                />
                {formErrors.designed_color && (
                  <div className="text-xs text-red-400">{formErrors.designed_color}</div>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-as-muted">
                  Royalty percentage
                </span>
                <div className="flex items-center gap-3">
                  <input
                  type="number"
                  name="royalties_percentage"
                  value={String(form.royalties_percentage ?? 5)}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    setForm((prev) => ({ ...prev, royalties_percentage: Number.isNaN(v) ? prev.royalties_percentage : v }))
                    // clear royalty error eagerly if valid
                    if (!Number.isNaN(v) && v >= 0 && v <= 100) {
                      setFormErrors((prev) => ({ ...prev, royalties_percentage: undefined }))
                    }
                  }}
                  className="pixel-input"
                  min={0}
                  max={100}
                  />
                  <button type="button" onClick={saveDefaultRoyalty} className="pixel-btn px-3 py-2 text-xs">Save as default</button>
                </div>
                {formErrors.royalties_percentage && (
                  <div className="text-xs text-red-400">{formErrors.royalties_percentage}</div>
                )}
                {savedDefaultMsg && <div className="text-xs text-green-300">{savedDefaultMsg}</div>}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-as-muted">
                  License type
                </span>
                <select
                  name="license_type"
                  value={form.license_type}
                  onChange={handleInput}
                  className="pixel-input"
                >
                  <option>All Rights Reserved</option>
                  <option>Creative Commons Attribution</option>
                  <option>Creative Commons NonCommercial</option>
                </select>
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
                <div className="rounded-2xl border border-as-border bg-as-background/50 p-4">
                  <h3 className="text-sm font-semibold text-as-heading">Estimated costs</h3>
                  <div className="mt-2 text-xs text-as-muted">
                    {apiEstimate ? (
                      <>
                        <div>File size: {apiEstimate.sizeMB} MB</div>
                        <div>IPFS pin estimate: {apiEstimate.pinCostAda} ADA</div>
                        <div>On-chain mint estimate: {apiEstimate.mintFeeAda} ADA</div>
                        <div className="mt-2 font-semibold">Estimated total: {apiEstimate.estimatedTotalAda} ADA</div>
                      </>
                    ) : (
                      <>
                        <div>File size: {estimated.sizeMB} MB</div>
                        <div>IPFS pin estimate: {estimated.pinCost} ADA</div>
                        <div>On-chain mint estimate (base): {estimated.baseMintFee} ADA</div>
                        <div className="mt-1 text-xs">Per-unit metadata surcharge applied when minting multiple units.</div>
                        {(() => {
                          const units = form.total_units ?? 1
                          const perUnit = Number((estimated.total * 1.0).toFixed(6))
                          const totalEst = Number((perUnit * units).toFixed(6))
                          return (
                            <>
                              <div className="mt-2">Estimated per unit (ADA): {perUnit}</div>
                              <div className="mt-1 font-semibold">Estimated total for {units} units: {totalEst} ADA</div>
                            </>
                          )
                        })()}
                      </>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-as-muted">This is a rough estimate for planning only.</div>
                </div>
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
      <PassportPreviewModal
        open={showPassportPreview}
        onClose={() => setShowPassportPreview(false)}
        onConfirm={confirmAndMint}
        passportJson={pendingPassport}
      />
    </div>
  )
}
