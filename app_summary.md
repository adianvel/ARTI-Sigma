# Product Requirements Document: Arti Preview

**Project Name:** Arti

**Version:** Immersive Registry Preview (October 18, 2025)

**Target Network:** Cardano Pre-Production

1. Background & Vision
- Vision: Celebrate immersive video, volumetric, and generative artworks with a curator-grade registry that preserves narrative intent and technical fidelity.
- Mission: Provide artists and collectors with transparent provenance, deterministic playback, and composable metadata for emerging media formats.

2. Problem Statement
- Motion-first artworks lose fidelity when forced into static NFT templates.
- Collectors lack reliable provenance that captures render specs, spatial audio, or interactive parameters.
- Artists need an accessible way to mint cinematic or 3D experiences without quality loss.

3. Target Audience
- Immersive video directors, realtime artists, and generative creators preparing premium drops.
- Collectors and curators who require verifiable provenance, edition notes, and exhibition guidance.
- Developers building custom viewers or gallery experiences atop Cardano metadata.

4. Product Goals
- Product: Deliver a self-serve minting console that accepts high-fidelity video and 3D assets with no loss of quality.
- User: Offer a polished gallery and dashboard experience where motion content plays back natively.
- Strategic: Establish a reference metadata schema for immersive art on Cardano.

5. Core Features
- F-01 Wallet Access: Permissionless Cardano wallet connection and minting.
- F-02 Minting Console: Guided flow for narrative, media metadata, and IPFS upload of master assets.
- F-03 Immersive Gallery: On-hover video playback and embedded 3D viewer for collected pieces.
- F-04 Collector Dashboard: "My Collection" grid filtered to the connected wallet.

6. Application Flow
Visitor -> Connects wallet -> Completes minting steps (Compose, Encode, Premiere) -> Approves transaction -> Art piece appears in personal collection and the public registry.

7. Data Model
- Art Piece Metadata
```ts
interface ArtPieceMetadata {
  title: string;
  artist_name: string;
  description: string;
  medium: "3D Animation" | "Video Art" | "Generative Art";
  file_url: string; // ipfs://...
  edition?: string;
  duration_or_dimensions?: string;
}
```
- CIP-721 Payload
```ts
interface ArtiCip721Metadata {
  name: string;
  description: string;
  image: string; // primary asset for preview
  files: Array<{ name: string; mediaType: string; src: string }>;
  art_piece: ArtPieceMetadata;
}
```

8. Architecture
- On-chain: CIP-721 metadata anchored on Cardano, pointing to IPFS assets.
- Off-chain: IPFS hosts master media and JSON descriptors, redundantly pinned.
- No centralized database is required for MVP.

9. Scope
Included: Wallet auth, immersive mint flow, Arti gallery, IPFS uploads, model-viewer integration.
Excluded: Fractional ownership, marketplace rails, automated royalties, fiat ramps.

10. Success Metrics
- Number of immersive drops minted and collected.
- Playback success rate of video and 3D assets.
- Growth of artists onboarded per quarter.