export type ArtMedium = "3D Animation" | "Video Art" | "Generative Art"

export interface ArtPieceMetadata {
  title: string
  artist_name: string
  description: string
  medium: ArtMedium
  file_url: string
  edition?: string
  duration_or_dimensions?: string
}

export interface ArtPieceFormValues {
  title: string
  artist_name: string
  description: string
  medium: ArtMedium | ""
  edition: string
  duration_or_dimensions: string
  designed_color?: string
  royalties_percentage?: number
  gallery_name?: string
  // License info (optional)
  license?: LicenseInfo
  // fractional minting fields
  total_units?: number
  sale_type?: 'direct' | 'partner'
  price_per_unit_idr?: number
  partner_share_percent?: number
}

export interface ArtiCip721Metadata {
  name: string
  description?: string
  // Optional short description or pointer to full metadata pinned on IPFS
  description_short?: string
  description_ipfs?: string
  image: string
  files: Array<{
    name: string
    mediaType: string
    src: string
  }>
  art_piece: ArtPieceMetadata
}

export interface ArtworksIDPassport {
  identity: {
    artworks_name: string
    date_of_released: string
  }
  attributes: {
    type: string
    designed_color: string
    arts_designed: 'unique' | 'masses'
  }
  unique_identification: {
    registered_number: string
  }
  provenance?: {
    designer_name?: string
    gallery_name?: string
  }
  platform_info: {
    image_url: string
    validation_tier: "Level 1 - Self Attested"
    minted_on: string
    application_version: "1.0"
    creator_wallet?: string
    royalties: {
      percentage: number
      recipient_wallet: string
      enforcement_standard: string // e.g. 'CIP-27'
    }
    copyright: LicenseInfo & {
      owner_name: string
      disclaimer: string
    }
  }
}

// Reusable license structure
export interface LicenseInfo {
  license_type?: string
  license_url?: string
}

export interface MintingRecord {
  txHash: string
  policyId?: string
  units?: string[] | string
  minted_at?: string // ISO time
  block_height?: number
}

// Allow passport to optionally include a minting record after issuance
export interface ArtworksIDPassportWithMint extends ArtworksIDPassport {
  minting_record?: MintingRecord
}

export interface FractionalInfo {
  total_units?: number
  sale_type?: 'direct' | 'partner'
  price_primary_idr?: number
  partner_share_percent?: number
  master_asset_ipfs?: string // ipfs://CID of the master asset (ArtworksIDPassport or media)
  price_set_at?: string // ISO timestamp when fiat price was set
}
