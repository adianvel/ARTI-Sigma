import { Blockfrost, Lucid, MintingPolicy, Network, PolicyId, TxHash, Unit, utf8ToHex } from "lucid-cardano"
import { ArtiCip721Metadata, ArtworksIDPassport } from "../types/passport"

export interface MintOptions {
  lucid: Lucid
  address: string
  name: string
  cipMetadata: ArtiCip721Metadata | ArtworksIDPassport
}

const resolveNetwork = (value?: string | null): Network => {
  const normalized = value?.trim()

  switch (normalized) {
    case "Mainnet":
    case "Testnet":
    case "Preview":
    case "Preprod":
      return normalized
    default:
      if (normalized) {
        console.warn(
          `Unsupported NEXT_PUBLIC_CARDANO_NETWORK value "${normalized}", defaulting to "Preprod"`
        )
      }
      return "Preprod"
  }
}

const getUnit = (policyId: PolicyId, name: string): Unit => policyId + utf8ToHex(name)

export const getMintingPolicy = (lucid: Lucid, address: string): MintingPolicy => {
  const { paymentCredential } = lucid.utils.getAddressDetails(address)
  if (!paymentCredential?.hash) {
    throw new Error("Unable to derive payment credential from wallet address")
  }

  return lucid.utils.nativeScriptFromJson({
    type: "all",
    scripts: [{ type: "sig", keyHash: paymentCredential.hash }],
  })
}

export const getPolicyId = (lucid: Lucid, policy: MintingPolicy): PolicyId =>
  lucid.utils.mintingPolicyToId(policy)

export const createSafeAssetName = (input: string): string => {
  if (!input) return "ARTI_Art_Piece"

  const safe = input
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_")

  return safe.slice(0, 30) || "ARTI_Art_Piece"
}

export const mintArtPieceToken = async ({
  lucid,
  address,
  name,
  cipMetadata,
}: MintOptions): Promise<{ txHash: TxHash; unit: Unit; policyId: PolicyId }> => {
  if (!lucid) throw new Error("Lucid instance is required")
  if (!address) throw new Error("Wallet address is required")

  const policy = getMintingPolicy(lucid, address)
  const policyId = getPolicyId(lucid, policy)
  const assetName = createSafeAssetName(name)
  const unit = getUnit(policyId, assetName)

  const tx = await lucid
    .newTx()
    .mintAssets({ [unit]: 1n })
    .attachMintingPolicy(policy)
    .attachMetadata(721, {
      [policyId]: {
        [assetName]: cipMetadata,
      },
    })
    .complete()

  const signedTx = await tx.sign().complete()
  const txHash = await signedTx.submit()

  return { txHash, unit, policyId }
}

export const mintFractionalPieces = async ({
  lucid,
  address,
  baseName,
  cipMetadataTemplate,
  totalUnits,
  masterAssetIpfs,
}: {
  lucid: Lucid
  address: string
  baseName: string
  cipMetadataTemplate: ArtiCip721Metadata | Record<string, any>
  totalUnits: number
  masterAssetIpfs?: string
}): Promise<{ txHash: TxHash; units: Unit[]; policyId: PolicyId }> => {
  if (!lucid) throw new Error('Lucid instance is required')
  if (!address) throw new Error('Wallet address is required')
  if (!totalUnits || totalUnits < 1) throw new Error('totalUnits must be >= 1')

  const policy = getMintingPolicy(lucid, address)
  const policyId = getPolicyId(lucid, policy)

  // Build mintAssets map and metadata per unit
  const assets: Record<string, bigint> = {}
  const metadata721: Record<string, any> = {}

  const safeBase = createSafeAssetName(baseName)
    for (let i = 1; i <= totalUnits; i++) {
    const unitName = `${safeBase}_${i}`
    const unit = getUnit(policyId, unitName)
    assets[unit] = 1n

    // Per-unit metadata: clone template and add unit index
    const assetMeta = typeof cipMetadataTemplate === 'function' ? cipMetadataTemplate(i) : { ...cipMetadataTemplate }
    if (assetMeta && typeof assetMeta === 'object') {
      assetMeta.unit_index = i
      if (masterAssetIpfs) assetMeta.master_asset_ipfs = masterAssetIpfs
    }

    metadata721[unitName] = assetMeta
  }

  const tx = await lucid.newTx().mintAssets(assets).attachMintingPolicy(policy).attachMetadata(721, { [policyId]: metadata721 }).complete()
  const signedTx = await tx.sign().complete()
  const txHash = await signedTx.submit()

  return { txHash, units: Object.keys(assets), policyId }
}

export const mintFractionalInBatches = async ({
  lucid,
  address,
  baseName,
  cipMetadataTemplate,
  totalUnits,
  batchSize = 20,
  masterAssetIpfs,
}: {
  lucid: Lucid
  address: string
  baseName: string
  cipMetadataTemplate: ArtiCip721Metadata | Record<string, any>
  totalUnits: number
  batchSize?: number
  masterAssetIpfs?: string
}): Promise<{ txHashes: TxHash[]; units: Unit[]; policyId: PolicyId }> => {
  if (!lucid) throw new Error('Lucid instance is required')
  if (!address) throw new Error('Wallet address is required')
  if (!totalUnits || totalUnits < 1) throw new Error('totalUnits must be >= 1')

  const policy = getMintingPolicy(lucid, address)
  const policyId = getPolicyId(lucid, policy)

  const safeBase = createSafeAssetName(baseName)

  const allUnits: Unit[] = []
  const allTxHashes: TxHash[] = []

  // iterate in batches
  for (let start = 1; start <= totalUnits; start += batchSize) {
    const end = Math.min(totalUnits, start + batchSize - 1)
    const assets: Record<string, bigint> = {}
    const metadata721: Record<string, any> = {}

    for (let i = start; i <= end; i++) {
      const unitName = `${safeBase}_${i}`
      const unit = policyId + utf8ToHex(unitName)
      assets[unit] = 1n

      const assetMeta = typeof cipMetadataTemplate === 'function' ? cipMetadataTemplate(i) : { ...cipMetadataTemplate }
      if (assetMeta && typeof assetMeta === 'object') {
        assetMeta.unit_index = i
        if (masterAssetIpfs) assetMeta.master_asset_ipfs = masterAssetIpfs
      }

      metadata721[unitName] = assetMeta
      allUnits.push(unit)
    }

    const tx = await lucid.newTx().mintAssets(assets).attachMintingPolicy(policy).attachMetadata(721, { [policyId]: metadata721 }).complete()
    const signedTx = await tx.sign().complete()
    const txHash = await signedTx.submit()
    allTxHashes.push(txHash)
  }

  return { txHashes: allTxHashes, units: allUnits, policyId }
}

export const burnArtPieceToken = async ({
  lucid,
  address,
  name,
}: {
  lucid: Lucid
  address: string
  name: string
}) => {
  const policy = getMintingPolicy(lucid, address)
  const policyId = getPolicyId(lucid, policy)
  const unit = getUnit(policyId, createSafeAssetName(name))

  const tx = await lucid
    .newTx()
    .mintAssets({ [unit]: -1n })
    .attachMintingPolicy(policy)
    .complete()

  const signedTx = await tx.sign().complete()
  return signedTx.submit()
}

export const createLucid = async (): Promise<Lucid> => {
  const network = resolveNetwork(process.env.NEXT_PUBLIC_CARDANO_NETWORK)
  const projectId =
    process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID ?? process.env.BLOCKFROST_PROJECT_ID
  if (!projectId) throw new Error("Missing Blockfrost project id")

  const blockfrost = new Blockfrost(
    process.env.NEXT_PUBLIC_BLOCKFROST_API_URL ?? "https://cardano-preprod.blockfrost.io/api/v0",
    projectId
  )

  return await Lucid.new(blockfrost, network)
}
