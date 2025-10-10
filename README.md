# 🐾 PetLog – Blockchain Pet Identity Platform

> **Hackathon Project**: Building trust in pet ownership through decentralized digital passports on Cardano

**Live Demo**: [https://petlog-jktji8nw4-mofttachs-projects.vercel.app](https://petlog-jktji8nw4-mofttachs-projects.vercel.app)

PetLog revolutionizes pet ownership verification by creating immutable, blockchain-based digital identities for pets. Built on Cardano Pre-Production testnet, each pet receives a unique NFT passport containing verified lineage, health records, and ownership history.

## 🎯 Problem Statement

- **42% of pedigree certificates in Asia are unverifiable** (Asian Kennel Network, 2024)
- **73% of veterinary clinics in Indonesia use manual records** (Indonesian Veterinary Association, 2023)
- **No standardized system** for pet data verification across developing markets

## 💡 Solution: Decentralized Trust Layer

PetLog creates a **blockchain-based trust network** where:
- 🧬 **Immutable Lineage Records** from certified breeders
- 💉 **Verified Health Logs** digitally signed by veterinarians  
- 🪪 **NFT Pet Passports** that travel with ownership transfers
- 🔗 **Validator Network** of trusted pedigree associations and clinics

## ✨ Key Features

- **🔐 Wallet Integration**: Seamless connection with Cardano wallets (Nami, Eternl, Gero, Flint)
- **🎨 Guided Minting Flow**: Intuitive pet passport creation with IPFS asset storage
- **📱 Personal Gallery**: View all owned pet passports with metadata resolution via Blockfrost
- **🔍 Passport Details**: Complete pet profiles with explorer links and provenance tracking
- **⚡ CIP-25 Compliant**: Following Cardano NFT metadata standards
- **🌐 IPFS Integration**: Decentralized storage via Pinata for pet photos and documents

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Cardano wallet (Nami, Eternl, etc.) configured for **Pre-Production** testnet
- Pinata account for IPFS storage
- Blockfrost API access

### Installation

1. **Clone and setup environment**:
   ```bash
   git clone https://github.com/Mofttach/petlog.git
   cd petlog
   cp .env.template .env.local
   ```

2. **Configure environment variables**:
   ```env
   PINATA_API_KEY=your_pinata_api_key
   PINATA_API_SECRET=your_pinata_secret
   BLOCKFROST_PROJECT_ID=your_preprod_project_id
   ```

3. **Install and run**:
   ```bash
   pnpm install
   pnpm dev
   ```

4. **Connect wallet and mint**: Visit `http://localhost:3000`, connect your Pre-Production wallet, and navigate to `/mint` to create your first pet passport!

## 🎮 Try the Demo

1. **Visit**: [https://petlog-jktji8nw4-mofttachs-projects.vercel.app](https://petlog-jktji8nw4-mofttachs-projects.vercel.app)
2. **Explore** the landing page design and problem/solution overview
3. **Connect** your Cardano Pre-Production wallet
4. **Mint** a pet passport NFT with custom metadata
5. **View** your collection in the personal gallery

## 🏗️ Architecture & Tech Stack

### Frontend
- **⚛️ Next.js 13** + TypeScript for modern React development
- **🎨 Tailwind CSS** with custom pixel art design system
- **📱 Responsive Design** optimized for mobile and desktop

### Blockchain Integration
- **🔗 Lucid Cardano** for transaction building and wallet connectivity
- **🌐 Blockfrost API** for blockchain data queries and UTxO resolution
- **🎫 CIP-25 NFT Standard** for metadata compliance
- **🔧 Cardano Pre-Production** testnet for development and testing

### Storage & Assets
- **📦 IPFS via Pinata** for decentralized asset storage
- **🖼️ Image Optimization** with Next.js Image component
- **📊 Metadata Schema** designed for pet identity verification

## 🌍 Environment Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BLOCKFROST_API_URL` | Blockfrost endpoint | Pre-Production |
| `NEXT_PUBLIC_IPFS_GATEWAY` | Public IPFS gateway | `ipfs.io` |
| `NEXT_PUBLIC_CARDANO_NETWORK` | Cardano network | `Preprod` |
| `PINATA_API_KEY` | Pinata API credentials | Required |
| `BLOCKFROST_PROJECT_ID` | Blockfrost project ID | Required |

## 🎯 Hackathon Highlights

### Innovation
- **First-of-its-kind** pet identity solution on Cardano
- **Pixel art design** system for engaging user experience
- **Multi-stakeholder** validator network (breeders, vets, associations)

### Technical Excellence
- **Type-safe** development with TypeScript
- **Responsive** mobile-first design
- **Production-ready** deployment on Vercel
- **Comprehensive** error handling and user feedback

### Social Impact
- **Addresses real-world problem** in pet industry trust
- **Scalable solution** for developing markets
- **Community-driven** validation network

## 📊 Project Status

- ✅ **MVP Complete**: Core minting and gallery functionality
- ✅ **Production Deployed**: Live on Vercel with Cardano integration  
- ✅ **User Testing**: Wallet connectivity and NFT minting validated
- 🔄 **Future Roadmap**: Validator network integration, multi-chain support

## 🤝 Contributing

This project is open for collaboration! Areas of interest:
- Validator network smart contracts
- Mobile app development  
- Multi-language support
- Advanced metadata schemas

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for the Cardano ecosystem** | **Hackathon 2025**
