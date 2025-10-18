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
