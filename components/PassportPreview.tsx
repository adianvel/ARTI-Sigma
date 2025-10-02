// Use standard img to avoid Next/Image remote domain constraints for previews
import { DigitalPetPassport, DigitalPetPassportForm } from "../types/passport"

type PassportPreviewProps = {
  formData: DigitalPetPassportForm | DigitalPetPassport
  imagePreview: string | null
}

export const PassportPreview = ({ formData, imagePreview }: PassportPreviewProps) => {
  return (
    <div className="pixel-card bg-white p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-48">
          {imagePreview ? (
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 aspect-square">
              <img
                src={imagePreview}
                alt={`Preview of ${formData.identity.cat_name || "pet"}`}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400">
              No image
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <header>
            <p className="text-xs uppercase tracking-wider text-blue-600">PetLog Digital Paw-ssport</p>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              {formData.identity.cat_name || "Your cat"}
            </h3>
            <p className="text-sm text-slate-500">Level 1 · Self Attested Certificate of Ownership</p>
          </header>

          <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
            <div>
              <dt className="text-slate-500">Date of Birth</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {formData.identity.date_of_birth || "--"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Breed</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">{formData.attributes.breed || "--"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Coat Color</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">{formData.attributes.coat_color || "--"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Sex</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">{formData.attributes.sex || "--"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Microchip Number</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {formData.unique_identification.microchip_number || "--"}
              </dd>
            </div>
            {formData.provenance?.sire_name && (
              <div>
                <dt className="text-slate-500">Sire</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">
                  {formData.provenance.sire_name}
                </dd>
              </div>
            )}
            {formData.provenance?.dam_name && (
              <div>
                <dt className="text-slate-500">Dam</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">
                  {formData.provenance.dam_name}
                </dd>
              </div>
            )}
          </dl>

          <footer className="pixel-card bg-slate-50 p-3 text-xs text-slate-700">
            <p>Pre-Production Testnet · Not yet verified</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
