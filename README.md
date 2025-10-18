# Arti - Immersive Art Registry

Arti is a curator-grade platform for minting immersive video, volumetric, and generative art drops on Cardano. Artists retain full fidelity for master files while collectors receive verifiable provenance and playback-ready showcases.

> "A premium digital canvas for cinematic and 3D masterpieces."

## Why Arti?
- **Motion preserved** - keep source frame rates, color grades, and audio stems without automatic compression.
- **3D ready** - publish GLB/GLTF packages that render in-browser with model-viewer support.
- **Collector grade** - issue Cardano-native tokens with immutable credits, edition notes, and licensing guidance.

## MVP Scope
- Minimalist dark UI optimised for video and 3D presentation.
- Guided minting flow that outputs the `ArtPieceMetadata` and CIP-721 payload.
- Wallet-connected gallery with inline video playback and embedded 3D viewer.
- Certificate page with IPFS-backed media, edition details, and explorer links.

## Data Model
```ts
interface ArtPieceMetadata {
  title: string
  artist_name: string
  description: string
  medium: "3D Animation" | "Video Art" | "Generative Art"
  file_url: string
  edition?: string
  duration_or_dimensions?: string
}

interface ArtiCip721Metadata {
  name: string
  description: string
  image: string
  files: Array<{ name: string; mediaType: string; src: string }>
  art_piece: ArtPieceMetadata
}
```

## Tech Stack
- Next.js 13 + TypeScript
- Tailwind CSS with a custom Arti theme
- Lucid Cardano + Blockfrost for blockchain access
- Pinata IPFS for media storage

## Getting Started
```bash
npm install
npm run dev
```
Set the required environment variables:
- `NEXT_PUBLIC_BLOCKFROST_PROJECT_ID`
- `PINATA_API_KEY`
- `PINATA_API_SECRET`

## Roadmap Highlights
- Real-time playback diagnostics for large installations
- Render farm signing and verification
- Collaborative multi-artist editions

Built between Yogyakarta and Singapore for the immersive art community.