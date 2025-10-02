# PetLog – Digital Passport DApp

PetLog lets cat owners mint self-attested digital passports on the Cardano Pre-Production testnet. Each passport is an NFT with IPFS-backed metadata that captures a pet’s identity, physical traits, and provenance. This codebase implements the V1.1 feature set described in the PRD.

## Features

- **Wallet connectivity** for Cardano testnet wallets (Nami, Eternl, Gero, Flint) with Lucid.
- **Guided minting flow** that collects identity data, uploads assets to Pinata/IPFS, and submits a CIP-25 compliant transaction.
- **Personal gallery** (`/my-passports`) that reads wallet UTxOs, resolves metadata from Blockfrost, and renders passport cards.
- **Passport detail view** with a full preview, explorer links, and provenance summary.

## Getting started

1. Copy the environment template and fill in the credentials:
   ```sh
   cp .env.template .env.local
   ```
   Required values:
   - `PINATA_API_KEY` / `PINATA_API_SECRET`
   - `BLOCKFROST_PROJECT_ID` (Pre-Production project)

2. Install dependencies and run the dev server:
   ```sh
   pnpm install
   pnpm dev
   ```

3. Use a wallet configured for the **Pre-Production** network, connect it via the header button, then visit `/mint` to create a passport.

## Key env variables

- `NEXT_PUBLIC_BLOCKFROST_API_URL` – Blockfrost endpoint (defaults to Pre-Production).
- `NEXT_PUBLIC_IPFS_GATEWAY` – Preferred public gateway for displaying images.
- `NEXT_PUBLIC_CARDANO_NETWORK` – Network passed to Lucid (`Preprod` by default).

## Tech stack

- [Next.js](https://nextjs.org/) + TypeScript
- [Lucid Cardano](https://lucid.spacebudz.io/) for chain interactions
- [Blockfrost](https://blockfrost.io/) for data queries
- [Pinata](https://www.pinata.cloud/) for IPFS pinning
- Tailwind CSS for styling

## License

MIT
# petlog
