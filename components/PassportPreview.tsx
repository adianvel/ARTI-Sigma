import { DigitalPetPassport, DigitalPetPassportForm } from "../types/passport"

type PassportPreviewProps = {
  formData: DigitalPetPassportForm | DigitalPetPassport
  imagePreview: string | null
}

export const PassportPreview = ({ formData, imagePreview }: PassportPreviewProps) => {
  return (
    <div className="pixel-card p-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="md:w-48">
          {imagePreview ? (
            <div className="aspect-square overflow-hidden rounded-pixel border border-pl-borderStrong bg-pl-surface">
              <img
                src={imagePreview}
                alt={`Preview of ${formData.identity.cat_name || "pet"}`}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-pixel border border-dashed border-pl-borderStrong text-pl-muted">
              No image
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <header className="space-y-1">
            <p className="text-sm uppercase tracking-[0.35em] text-pl-muted">PetLog Digital Paw-ssport</p>
            <h3 className="font-display text-2xl tracking-[0.2em] text-pl-heading">
              {formData.identity.cat_name || "Your cat"}
            </h3>
            <p className="text-base text-pl-muted">Level 1 - Self Attested Certificate of Ownership</p>
          </header>

          <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
            <div>
              <dt className="text-sm uppercase tracking-[0.25em] text-pl-muted">Date of Birth</dt>
              <dd className="font-semibold text-pl-heading">{formData.identity.date_of_birth || "--"}</dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-[0.25em] text-pl-muted">Breed</dt>
              <dd className="font-semibold text-pl-heading">{formData.attributes.breed || "--"}</dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-[0.25em] text-pl-muted">Coat Color</dt>
              <dd className="font-semibold text-pl-heading">{formData.attributes.coat_color || "--"}</dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-[0.25em] text-pl-muted">Sex</dt>
              <dd className="font-semibold text-pl-heading">{formData.attributes.sex || "--"}</dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-[0.25em] text-pl-muted">Microchip Number</dt>
              <dd className="font-semibold text-pl-heading">
                {formData.unique_identification.microchip_number || "--"}
              </dd>
            </div>
            {formData.provenance?.sire_name && (
              <div>
                <dt className="text-sm uppercase tracking-[0.25em] text-pl-muted">Sire</dt>
                <dd className="font-semibold text-pl-heading">{formData.provenance.sire_name}</dd>
              </div>
            )}
            {formData.provenance?.dam_name && (
              <div>
                <dt className="text-sm uppercase tracking-[0.25em] text-pl-muted">Dam</dt>
                <dd className="font-semibold text-pl-heading">{formData.provenance.dam_name}</dd>
              </div>
            )}
          </dl>

          <footer className="rounded-pixel border border-pl-border bg-pl-highlight p-3 text-sm uppercase tracking-[0.25em] text-pl-heading">
            Pre-Production Testnet - Not yet verified
          </footer>
        </div>
      </div>
    </div>
  )
}

