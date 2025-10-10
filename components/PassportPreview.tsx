import { DigitalPetPassport, DigitalPetPassportForm } from "../types/passport"

type PassportPreviewProps = {
  formData: DigitalPetPassportForm | DigitalPetPassport
  imagePreview: string | null
}

export const PassportPreview = ({ formData, imagePreview }: PassportPreviewProps) => {
  return (
    <div className="rounded-[32px] bg-white p-8 shadow-[0_24px_60px_rgba(0,0,0,0.1)] ring-1 ring-gray-100">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-52">
          {imagePreview ? (
            <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg ring-1 ring-gray-200">
              <img
                src={imagePreview}
                alt={`Preview of ${formData.identity.cat_name || "pet"}`}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">🐾</div>
                <div className="text-sm">No image</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-6">
          <header className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700 ring-1 ring-purple-200">
              🐾 PetLog Digital Passport
            </span>
            <h3 className="text-3xl font-semibold text-pl-heading">
              {formData.identity.cat_name || "Your Pet"}
            </h3>
            <p className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 inline-block">
              Level 1 - Self Attested Certificate
            </p>
          </header>

          <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-3 ring-1 ring-blue-100">
              <dt className="text-xs font-medium text-blue-600 uppercase tracking-wider">Date of Birth</dt>
              <dd className="mt-1 font-semibold text-pl-heading">{formData.identity.date_of_birth || "--"}</dd>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-3 ring-1 ring-green-100">
              <dt className="text-xs font-medium text-green-600 uppercase tracking-wider">Breed</dt>
              <dd className="mt-1 font-semibold text-pl-heading">{formData.attributes.breed || "--"}</dd>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-100 px-4 py-3 ring-1 ring-purple-100">
              <dt className="text-xs font-medium text-purple-600 uppercase tracking-wider">Coat Color</dt>
              <dd className="mt-1 font-semibold text-pl-heading">{formData.attributes.coat_color || "--"}</dd>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-red-100 px-4 py-3 ring-1 ring-orange-100">
              <dt className="text-xs font-medium text-orange-600 uppercase tracking-wider">Sex</dt>
              <dd className="mt-1 font-semibold text-pl-heading">{formData.attributes.sex || "--"}</dd>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-100 px-4 py-3 ring-1 ring-cyan-100">
              <dt className="text-xs font-medium text-cyan-600 uppercase tracking-wider">Microchip Number</dt>
              <dd className="mt-1 font-semibold text-pl-heading font-mono text-sm">
                {formData.unique_identification.microchip_number || "--"}
              </dd>
            </div>
            {formData.provenance?.sire_name && (
              <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-green-100 px-4 py-3 ring-1 ring-teal-100">
                <dt className="text-xs font-medium text-teal-600 uppercase tracking-wider">Sire</dt>
                <dd className="mt-1 font-semibold text-pl-heading">{formData.provenance.sire_name}</dd>
              </div>
            )}
            {formData.provenance?.dam_name && (
              <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-100 px-4 py-3 ring-1 ring-rose-100">
                <dt className="text-xs font-medium text-rose-600 uppercase tracking-wider">Dam</dt>
                <dd className="mt-1 font-semibold text-pl-heading">{formData.provenance.dam_name}</dd>
              </div>
            )}
          </dl>

          <footer className="rounded-2xl bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-3 ring-1 ring-amber-200">
            <div className="flex items-center gap-2">
              <span className="text-amber-600">⚠️</span>
              <span className="text-sm font-medium text-amber-700">Pre-Production Testnet - Not yet verified</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

