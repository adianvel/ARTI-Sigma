import { useEffect, useMemo, useState } from "react"
import { PawPrint } from "lucide-react"
import { useRouter } from "next/router"
import Link from "next/link"
import { PassportPreview } from "../../components/PassportPreview"
import { DigitalPetPassport } from "../../types/passport"
import { normalizeAssetUnit } from "../../utils/cardano"

const explorerBase = process.env.NEXT_PUBLIC_EXPLORER_ASSET_URL ?? "https://preprod.cexplorer.io/asset/"

export default function PassportDetailPage() {
  const router = useRouter()
  const { id } = router.query

  const normalizedAsset = useMemo(() => {
    if (!id) return null
    const raw = Array.isArray(id) ? id[0] : id
    if (!raw) return null
    return normalizeAssetUnit(raw)
  }, [id])

  const [passport, setPassport] = useState<DigitalPetPassport | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadPassport = async () => {
      if (!normalizedAsset) return
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/blockfrost/assets/${encodeURIComponent(normalizedAsset)}`)
        if (!response.ok) throw new Error("Unable to fetch asset details")

        const assetData = await response.json()
        const metadata = assetData.onchain_metadata ?? {}

        let passportData: DigitalPetPassport | null = null

        if (metadata.passport) {
          passportData = metadata.passport as DigitalPetPassport
        } else if (metadata.files?.[0]?.src) {
          const cid = metadata.files[0].src.replace("ipfs://", "")
          const metadataResponse = await fetch(`https://ipfs.io/ipfs/${cid}`)
          if (metadataResponse.ok) {
            passportData = (await metadataResponse.json()) as DigitalPetPassport
          }
        }

        if (!passportData) {
          throw new Error("This passport does not include PetLog metadata")
        }

        setPassport(passportData)
        const imageCid = passportData.platform_info.image_url.replace("ipfs://", "")
        setImagePreview(`https://purple-persistent-booby-135.mypinata.cloud/ipfs/${imageCid}`)
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "Failed to load passport metadata")
      } finally {
        setIsLoading(false)
      }
    }

    loadPassport()
  }, [normalizedAsset])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-pl-body">
        <div className="yarn-ball" />
        <p className="mt-3 text-lg text-pl-muted">One moment... fetching your Paw-ssport</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pixel-card mx-auto max-w-xl space-y-3 p-6 text-center text-pl-heading">
        <p className="font-display text-lg tracking-[0.25em]">Unable to load passport</p>
        <p className="text-base text-pl-body">{error}</p>
        <Link href="/my-passports" className="inline-flex items-center justify-center gap-2">
          <span className="pixel-btn pixel-btn--secondary px-5 py-2 text-base uppercase tracking-[0.3em]">
            <PawPrint size={16} aria-hidden /> Back to gallery
          </span>
        </Link>
      </div>
    )
  }

  if (!passport || !normalizedAsset) {
    return null
  }

  return (
    <section className="space-y-8 text-pl-body">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-pl-muted">
            Passport #{normalizedAsset.slice(-6)}
          </p>
          <h1 className="font-display text-4xl tracking-[0.2em] text-pl-heading">
            {passport.identity.cat_name}&apos;s Digital Passport
          </h1>
          <p className="text-sm text-pl-muted">Level 1 self-attested certificate · Cardano Pre-Production</p>
        </div>
        <Link
          href="/my-passports"
          className="pixel-btn px-5 py-2 text-base uppercase tracking-[0.3em]"
        >
          Back
        </Link>
      </div>

      <PassportPreview formData={passport} imagePreview={imagePreview} />

      <div className="pixel-card grid gap-4 p-6 text-base">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-pl-muted">Asset unit</p>
          <p className="mt-1 break-all font-mono text-pl-heading">{normalizedAsset}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-pl-muted">Minted on</p>
          <p className="mt-1">{new Date(passport.platform_info.minted_on).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-pl-muted">Status</p>
          <p className="mt-1">Self-attested (Level 1). Verification not yet requested.</p>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={`${explorerBase}${normalizedAsset}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-btn pixel-btn--primary inline-flex items-center gap-2 px-5 py-2 text-base uppercase tracking-[0.3em]"
          >
            View on explorer
          </a>
        </div>
      </div>
    </section>
  )
}


