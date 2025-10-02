import { ChangeEvent, FormEvent, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { PassportPreview } from "../../components/PassportPreview"
import { useLucid } from "../../contexts/LucidContext"
import { mintPetLogPassport } from "../../lib/minting-utils"
import { DigitalPetPassport, DigitalPetPassportForm, PetLogCipMetadata } from "../../types/passport"

const initialForm: DigitalPetPassportForm = {
  identity: { cat_name: "", date_of_birth: "" },
  attributes: { breed: "", coat_color: "", sex: "Male" },
  unique_identification: { microchip_number: "" },
  provenance: { sire_name: "", dam_name: "" },
}

const steps = ["Identity", "Details", "Preview"]

export default function MintPage() {
  const router = useRouter()
  const { lucid, account } = useLucid()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<DigitalPetPassportForm>(initialForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isMinting, setIsMinting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const handleInput = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    const [group, field] = name.split(".")

    setForm((prev) => ({
      ...prev,
      [group]: {
        ...(prev as any)[group],
        [field]: value,
      },
    }))
  }

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const canProceed = useMemo(() => {
    if (step === 0) {
      return Boolean(
        form.identity.cat_name &&
          form.identity.date_of_birth &&
          form.attributes.breed &&
          form.attributes.coat_color &&
          form.attributes.sex
      )
    }

    if (step === 1) {
      return Boolean(form.unique_identification.microchip_number && imageFile)
    }

    return true
  }, [step, form, imageFile])

  const goNext = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1)
      setError(null)
    }
  }

  const goBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1)
    }
  }

  const buildPassportMetadata = (imageCid: string): DigitalPetPassport => {
    return {
      ...form,
      platform_info: {
        image_url: `ipfs://${imageCid}`,
        validation_tier: "Level 1 - Self Attested",
        minted_on: new Date().toISOString(),
        application_version: "1.0",
      },
    }
  }

  const handleMint = async (event: FormEvent) => {
    event.preventDefault()
    if (!lucid || !account?.address) {
      setError("Please connect a Cardano wallet before minting.")
      return
    }
    if (!imageFile) {
      setError("A passport photo is required.")
      return
    }

    try {
      setIsMinting(true)
      setError(null)
      setStatus("Sending your new Paw-ssport to the Cardano universe...")

      const body = new FormData()
      body.append("image", imageFile)
      body.append("cat_name", form.identity.cat_name)
      body.append("date_of_birth", form.identity.date_of_birth)
      body.append("breed", form.attributes.breed)
      body.append("coat_color", form.attributes.coat_color)
      body.append("sex", form.attributes.sex)
      body.append("microchip_number", form.unique_identification.microchip_number)
      body.append("sire_name", form.provenance?.sire_name ?? "")
      body.append("dam_name", form.provenance?.dam_name ?? "")

      const uploadResponse = await fetch("/api/mint-asset", {
        method: "POST",
        body,
      })

      if (!uploadResponse.ok) {
        const message = await uploadResponse.json().catch(() => ({ error: uploadResponse.statusText }))
        throw new Error(message.error || "Failed to upload assets to IPFS")
      }

      const { image, metadata } = (await uploadResponse.json()) as { image: string; metadata: string }
      if (!image || !metadata) {
        throw new Error("Upload API did not return valid IPFS hashes")
      }

      const passport = buildPassportMetadata(image)
      const cipMetadata: PetLogCipMetadata = {
        name: `PetLog Passport - ${form.identity.cat_name}`,
        image: `ipfs://${image}`,
        description: `Self-attested digital passport for ${form.identity.cat_name}`,
        files: [
          {
            name: "PetLog Passport Metadata",
            mediaType: "application/json",
            src: `ipfs://${metadata}`,
          },
        ],
        passport,
      }

      const { txHash, unit } = await mintPetLogPassport({
        lucid,
        address: account.address,
        name: form.identity.cat_name,
        cipMetadata,
      })
      // Success microcopy
      try {
        window.alert(`Success! ${form.identity.cat_name}'s Paw-ssport is now officially on the blockchain!`)
      } catch {}
      setStatus(null)
      router.push(`/mint/success?tx=${txHash}&asset=${unit}`)
    } catch (err) {
      console.error("Mint failed", err)
      setError(err instanceof Error ? err.message : "Failed to mint passport")
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <form onSubmit={handleMint} className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">Mint Digital Passport</h1>
        <p className="text-sm text-slate-500">
          Complete the guided flow to create a Level 1 self-attested ownership certificate for your cat.
        </p>
      </header>

      <div className="flex items-center justify-center gap-3 text-sm">
        {steps.map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                index === step
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-slate-300 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900"
              }`}
            >
              {index + 1}
            </span>
            <span className={`hidden text-slate-600 sm:inline ${index === step ? "font-medium" : "text-slate-400"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {step === 0 && (
        <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Identity</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span>Cat name</span>
              <input
                name="identity.cat_name"
                value={form.identity.cat_name}
                onChange={handleInput}
                className="pixel-input px-3 py-2 text-slate-800"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Date of birth</span>
              <input
                type="date"
                name="identity.date_of_birth"
                value={form.identity.date_of_birth}
                onChange={handleInput}
                className="pixel-input px-3 py-2 text-slate-800"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Breed</span>
              <input
                name="attributes.breed"
                value={form.attributes.breed}
                onChange={handleInput}
                className="pixel-input px-3 py-2 text-slate-800"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Coat color</span>
              <input
                name="attributes.coat_color"
                value={form.attributes.coat_color}
                onChange={handleInput}
                className="pixel-input px-3 py-2 text-slate-800"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Sex</span>
              <select
                name="attributes.sex"
                value={form.attributes.sex}
                onChange={handleInput}
                className="pixel-input px-3 py-2 text-slate-800"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Details & Photo</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span>Microchip number</span>
              <input
                name="unique_identification.microchip_number"
                value={form.unique_identification.microchip_number}
                onChange={handleInput}
                className="pixel-input px-3 py-2 text-slate-800"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Sire name (optional)</span>
              <input
                name="provenance.sire_name"
                value={form.provenance?.sire_name ?? ""}
                onChange={handleInput}
                className="pixel-input px-3 py-2 text-slate-800"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Dam name (optional)</span>
              <input
                name="provenance.dam_name"
                value={form.provenance?.dam_name ?? ""}
                onChange={handleInput}
                className="pixel-input px-3 py-2 text-slate-800"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Passport photo</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImage}
                className="pixel-input px-3 py-2 text-slate-800"
              />
              <span className="text-xs text-slate-500">JPEG, PNG, or WebP up to 5MB.</span>
            </label>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-6">
          <PassportPreview formData={form} imagePreview={imagePreview} />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
            <p className="font-medium">Heads up</p>
            <p>
              Level 1 passports are self-attested. Ensure all information is accurate before minting - once
              recorded on chain it cannot be altered.
            </p>
          </div>
        </section>
      )}

      <div aria-live="polite" className="space-y-2">
        {error && (
          <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}
        {status && !error && (
          <div className="flex items-center justify-center gap-3 rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
            <div className="yarn-ball" />
            <p>{status}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0 || isMinting}
          className="pixel-btn bg-white px-5 py-2 text-xs disabled:opacity-50"
        >
          Back
        </button>

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canProceed || isMinting}
            className="pixel-btn pixel-btn--primary px-5 py-2 text-xs disabled:opacity-60"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={isMinting}
            className="pixel-btn pixel-btn--secondary px-6 py-2 text-xs disabled:opacity-60"
          >
            {isMinting ? "Sending your Paw-ssport..." : "Mint my Paw-ssport"}
          </button>
        )}
      </div>
    </form>
  )
}
