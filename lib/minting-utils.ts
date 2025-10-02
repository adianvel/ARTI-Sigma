import { Blockfrost, Lucid, MintingPolicy, PolicyId, TxHash, Unit, utf8ToHex } from "lucid-cardano"
import { DigitalPetPassport, PetLogCipMetadata } from "../types/passport"

type CardanoNetwork = "Mainnet" | "Preprod" | "Preview" | "Testnet" | string

export interface MintOptions {
  lucid: Lucid
  address: string
  name: string
  cipMetadata: PetLogCipMetadata
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

export const getPolicyId = (lucid: Lucid, policy: MintingPolicy): PolicyId => lucid.utils.mintingPolicyToId(policy)

const createSafeAssetName = (input: string): string => {
  if (!input) return "PetLog_Passport"

  const safe = input
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_")

  return safe.slice(0, 30) || "PetLog_Passport"
}

export const mintPetLogPassport = async ({ lucid, address, name, cipMetadata }: MintOptions): Promise<{ txHash: TxHash; unit: Unit; policyId: PolicyId }> => {
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

export const burnPassport = async ({ lucid, address, name }: { lucid: Lucid; address: string; name: string }) => {
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
  const network = (process.env.NEXT_PUBLIC_CARDANO_NETWORK ?? "Preprod") as CardanoNetwork
  const projectId = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID ?? process.env.BLOCKFROST_PROJECT_ID
  if (!projectId) throw new Error("Missing Blockfrost project id")

  const blockfrost = new Blockfrost(
    process.env.NEXT_PUBLIC_BLOCKFROST_API_URL ?? "https://cardano-preprod.blockfrost.io/api/v0",
    projectId
  )

  return await Lucid.new(blockfrost, network)
}
