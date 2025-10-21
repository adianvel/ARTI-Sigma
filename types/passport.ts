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
  license_type?: string
  // fractional minting fields
  total_units?: number
  sale_type?: 'direct' | 'partner'
  price_per_unit_idr?: number
  partner_share_percent?: number
}

export interface ArtiCip721Metadata {
  name: string
  description: string
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
    royalties: {
      percentage: number
      recipient_wallet: string
      enforcement_standard: string // e.g. 'CIP-27'
    }
    copyright: {
      owner_name: string
      license_type: string
      disclaimer: string
      license_url?: string
    }
  }
}

export interface FractionalInfo {
  total_units?: number
  sale_type?: 'direct' | 'partner'
  price_primary_idr?: number
  partner_share_percent?: number
  master_asset_ipfs?: string // ipfs://CID of the master asset (ArtworksIDPassport or media)
}
