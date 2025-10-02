export interface DigitalPetPassport {
  identity: {
    cat_name: string
    date_of_birth: string
  }
  attributes: {
    breed: string
    coat_color: string
    sex: "Male" | "Female"
  }
  unique_identification: {
    microchip_number: string
  }
  provenance?: {
    sire_name?: string
    dam_name?: string
  }
  platform_info: {
    image_url: string
    validation_tier: "Level 1 - Self Attested"
    minted_on: string
    application_version: "1.0"
  }
}

export interface DigitalPetPassportForm extends Omit<DigitalPetPassport, "platform_info"> {}

export interface PetLogCipMetadata {
  name: string
  image: string
  description: string
  files: Array<{
    name: string
    mediaType: string
    src: string
  }>
  passport: DigitalPetPassport
}
