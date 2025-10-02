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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="yarn-ball" />
        <p className="mt-3 text-sm text-slate-500">One moment… fetching your Paw-ssport</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
        <p className="font-medium">Unable to load passport</p>
        <p className="text-sm">{error}</p>
        <Link href="/my-passports" className="mt-4 inline-flex rounded-full border border-red-400 px-4 py-2 text-sm">
          Back to gallery
        </Link>
      </div>
    )
  }

  if (!passport || !normalizedAsset) {
    return null
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-blue-600">Passport #{normalizedAsset.slice(-6)}</p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
            {passport.identity.cat_name}&apos;s Digital Passport
          </h1>
          <p className="text-sm text-slate-500">Level 1 self-attested certificate - Cardano Pre-Production</p>
        </div>
        <Link
          href="/my-passports"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-400 hover:text-slate-900"
        >
          Back
        </Link>
      </div>

      <PassportPreview formData={passport} imagePreview={imagePreview} />

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Asset unit</p>
          <p className="break-all font-mono text-slate-800 dark:text-slate-100">{normalizedAsset}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Minted on</p>
          <p>{new Date(passport.platform_info.minted_on).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Status</p>
          <p>Self-attested (Level 1). Verification not yet requested.</p>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={`${explorerBase}${normalizedAsset}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-blue-400 px-4 py-2 text-xs font-semibold text-blue-600 transition hover:border-blue-500 hover:text-blue-700 dark:text-blue-300"
          >
            View on explorer
          </a>
        </div>
      </div>
    </section>
  )
}
