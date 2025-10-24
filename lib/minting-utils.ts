import { ArtiCip721Metadata, ArtworksIDPassport } from "../types/passport"

// Avoid top-level imports from 'lucid-cardano' to prevent ESM/CJS interop errors.
// Declare minimal local types for compilation and perform dynamic imports at runtime.
type Lucid = any
type MintingPolicy = any
type Network = "Preprod" | "Mainnet" | "Testnet" | "Preview"
type PolicyId = string
type TxHash = string
type Unit = string

// Provide a runtime-safe utf8ToHex helper.
// lucid-cardano exports utf8ToHex, but in some bundling/runtime setups it may not be
// available at module-evaluation time. We prefer the lucid helper when present and
// otherwise fall back to a small local implementation using TextEncoder/Buffer.
const runtimeUtf8ToHex = (input: string): string => {
  const g = globalThis as any
  if (g && typeof g.utf8ToHex === 'function') return g.utf8ToHex(input)

  // Node and modern browsers: use TextEncoder to get bytes then convert to hex
  try {
    if (typeof TextEncoder !== 'undefined') {
      const enc = new TextEncoder()
      const bytes = enc.encode(input)
      return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
    }
  } catch (e) {
    // ignore and fallback to Buffer if available
  }

  // Fallback for older Node environments
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const buf = Buffer.from(input, 'utf8')
    return buf.toString('hex')
  } catch (e) {
    // As a last resort, perform a simple UTF-16 based encoding (not ideal, but prevents crashes)
    return Array.from(input).map((c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
  }
}

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

const getUnit = (policyId: PolicyId, name: string): Unit => policyId + runtimeUtf8ToHex(name)

// Cardano metadata strings are limited (node enforces ~64 bytes per string).
// Ensure we don't attach overly long strings on-chain. Keep URLs intact.
const MAX_METADATA_STRING = 64
const looksLikeUrl = (s: string) => /^(https?:\/\/|ipfs:\/\/)/i.test(s)
// Helpers to measure UTF-8 byte length and truncate strings by bytes.
const utf8ByteLength = (s: string) => {
  try {
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(s).length
  } catch (e) {}
  try {
    return Buffer.from(s, 'utf8').length
  } catch (e) {
    // Fallback: approximate by string length
    return s.length
  }
}

const truncateToMaxBytes = (s: string, maxBytes: number) => {
  try {
    const encoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null
    if (encoder) {
      const bytes = encoder.encode(s)
      if (bytes.length <= maxBytes) return s
      // build by scanning code points until byte length fits
      let out = ''
      let len = 0
      for (const ch of s) {
        const chBytes = encoder.encode(ch).length
        if (len + chBytes > maxBytes - 3) break
        out += ch
        len += chBytes
      }
      return out + '...'
    }
  } catch (e) {}
  // Node Buffer fallback
  try {
    const buf = Buffer.from(s, 'utf8')
    if (buf.length <= maxBytes) return s
    // iterate code units and slice buffer
    let out = ''
    let len = 0
    for (const ch of s) {
      const cb = Buffer.from(ch, 'utf8')
      if (len + cb.length > maxBytes - 3) break
      out += ch
      len += cb.length
    }
    return out + '...'
  } catch (e) {}
  // last-resort character-based truncation
  if (s.length <= maxBytes) return s
  return s.slice(0, Math.max(0, maxBytes - 3)) + '...'
}

function sanitizeForOnChain(value: any): any {
  if (value === null || value === undefined) return value
  if (typeof value === 'string') {
    const byteLen = utf8ByteLength(value)
    if (byteLen <= MAX_METADATA_STRING) return value
    if (looksLikeUrl(value)) return value // allow URLs
    return truncateToMaxBytes(value, MAX_METADATA_STRING)
  }
  if (Array.isArray(value)) return value.map((v) => sanitizeForOnChain(v))
  if (typeof value === 'object') {
    const out: any = {}
    for (const k of Object.keys(value)) {
      out[k] = sanitizeForOnChain((value as any)[k])
    }
    return out
  }
  return value
}

type TruncateReport = { path: string; length: number; sample?: string }

function sanitizeAndReport(value: any, path = ''): { value: any; truncated: TruncateReport[] } {
  const truncated: TruncateReport[] = []

  function helper(v: any, p: string): any {
    if (v === null || v === undefined) return v
    if (typeof v === 'string') {
      const byteLen = utf8ByteLength(v)
      if (byteLen <= MAX_METADATA_STRING) return v
      if (looksLikeUrl(v)) return v
      truncated.push({ path: p || '<root>', length: byteLen, sample: v.slice(0, 80) })
      return truncateToMaxBytes(v, MAX_METADATA_STRING)
    }
    if (Array.isArray(v)) return v.map((it, i) => helper(it, `${p}[${i}]`))
    if (typeof v === 'object') {
      const out: any = {}
      for (const k of Object.keys(v)) {
        out[k] = helper((v as any)[k], p ? `${p}.${k}` : k)
      }
      return out
    }
    return v
  }

  const out = helper(value, path)
  return { value: out, truncated }
}

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

  // Ensure resulting asset name encodes to at most 32 bytes when UTF-8 encoded.
  // We will truncate by bytes, preserving whole characters when possible.
  const MAX_ASSET_NAME_BYTES = 32
  if (utf8ByteLength(safe) <= MAX_ASSET_NAME_BYTES) return safe || "ARTI_Art_Piece"

  // Truncate safely by bytes
  let out = ''
  let len = 0
  for (const ch of safe) {
    const chBytes = (typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(ch).length : Buffer.from(ch, 'utf8').length)
    if (len + chBytes > MAX_ASSET_NAME_BYTES) break
    out += ch
    len += chBytes
  }
  // If result is empty, fallback to a short constant name
  if (!out) return "ARTI_Art_Piece"
  return out
}

const debugAssetName = (label: string, name: string) => {
  try {
    if (process.env.NODE_ENV === 'production') return
    const bytes = utf8ByteLength(name)
    // use debug to avoid noisy logs in normal console output
    // eslint-disable-next-line no-console
    console.debug(`[ARTI DEBUG] ${label} name="${name}" bytes=${bytes}`)
  } catch (e) {
    // ignore
  }
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
  debugAssetName('mintArtPiece assetName', assetName)
  const unit = getUnit(policyId, assetName)

  const tx = await lucid
    .newTx()
    .mintAssets({ [unit]: 1n })
    .attachMintingPolicy(policy)
          .attachMetadata(721, {
            [policyId]: {
              [assetName]: await (async () => {
          try {
            // If cipMetadata contains a files[] entry that references an ArtworksIDPassport on IPFS,
            // fetch it and copy royalties into the on-chain metadata for convenience.
            if (cipMetadata && typeof cipMetadata === 'object' && Array.isArray((cipMetadata as any).files)) {
              const files = (cipMetadata as any).files as Array<any>
              const passFile = files.find((f) => f && f.name === 'ArtworksIDPassport' && typeof f.src === 'string')
              if (passFile && passFile.src && typeof passFile.src === 'string') {
                try {
                  const ipfsHash = passFile.src.replace(/^ipfs:\/\//, '')
                  const gateway = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/'
                  const resp = await fetch(`${gateway}${ipfsHash}`)
                  if (resp.ok) {
                    const json = await resp.json()
                    if (json?.platform_info?.royalties) {
                      // Avoid copying full wallet addresses on-chain (they can exceed metadata limits).
                      const rawRoy = json.platform_info.royalties
                      const safeRoy: any = { percentage: rawRoy.percentage }
                      if (rawRoy.enforcement_standard) safeRoy.enforcement_standard = rawRoy.enforcement_standard
                      // If recipient_wallet is short enough, include a shortened form, otherwise omit
                      if (typeof rawRoy.recipient_wallet === 'string') {
                        const rw = String(rawRoy.recipient_wallet)
                        if (rw.length <= MAX_METADATA_STRING) {
                          safeRoy.recipient_wallet = rw
                        } else {
                          // include a trimmed hint (prefix + suffix) within limits
                          const prefix = rw.slice(0, 12)
                          const suffix = rw.slice(-8)
                          const candidate = `${prefix}...${suffix}`
                          safeRoy.recipient_wallet = candidate.length <= MAX_METADATA_STRING ? candidate : undefined
                        }
                      }
                      return sanitizeForOnChain({ ...(cipMetadata as any), royalties: safeRoy })
                    }
                  }
                } catch (e) {
                  // ignore fetch errors and fall back to original metadata
                }
              }
            }
          } catch (e) {
            // ignore
          }
                const r = sanitizeAndReport(cipMetadata)
                if (r.truncated.length > 0) {
                  try {
                    console.warn('Sanitized metadata fields before on-chain attach:', JSON.stringify(r.truncated, null, 2))
                  } catch (e) {}
                }
                return r.value
        })(),
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

  // Reserve room for suffix like _{n}. Ensure final asset name bytes <= 32.
  const rawSafeBase = createSafeAssetName(baseName)
  // Calculate max bytes available for base after adding suffix (we'll assume up to 4 chars for suffix like _9999)
  const SUFFIX_RESERVED_BYTES = 6 // conservative: underscore + up to 5 digits encoded in UTF-8
  const MAX_ASSET_NAME_BYTES = 32
  const baseMaxBytes = Math.max(1, MAX_ASSET_NAME_BYTES - SUFFIX_RESERVED_BYTES)

  // Helper to produce a base truncated to byte limit
  const makeBaseWithLimit = (s: string) => {
    if (utf8ByteLength(s) <= baseMaxBytes) return s
    let out = ''
    let len = 0
    for (const ch of s) {
      const chBytes = (typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(ch).length : Buffer.from(ch, 'utf8').length)
      if (len + chBytes > baseMaxBytes) break
      out += ch
      len += chBytes
    }
    return out || 'ARTI'
  }

  const safeBase = makeBaseWithLimit(rawSafeBase)
  for (let i = 1; i <= totalUnits; i++) {
  const unitName = `${safeBase}_${i}`
  debugAssetName('mintFractionalPieces unitName', unitName)
  const unit = getUnit(policyId, unitName)
    assets[unit] = 1n

    // Per-unit metadata: clone template and add unit index
    const assetMeta = typeof cipMetadataTemplate === 'function' ? cipMetadataTemplate(i) : { ...cipMetadataTemplate }
    if (assetMeta && typeof assetMeta === 'object') {
      assetMeta.unit_index = i
      if (masterAssetIpfs) assetMeta.master_asset_ipfs = masterAssetIpfs
      // attempt to stitch royalties into per-unit metadata if template references passport
      try {
        if (Array.isArray((assetMeta as any).files)) {
          const passFile = (assetMeta as any).files.find((f: any) => f && f.name === 'ArtworksIDPassport' && typeof f.src === 'string')
          if (passFile) {
            const ipfsHash = String(passFile.src).replace(/^ipfs:\/\//, '')
            const gateway = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/'
            // perform a lightweight fetch but don't block minting if it fails
            try {
              // eslint-disable-next-line no-await-in-loop
              const resp = await fetch(`${gateway}${ipfsHash}`)
              if (resp.ok) {
                // eslint-disable-next-line no-await-in-loop
                const j = await resp.json()
                if (j?.platform_info?.royalties) {
                  const rawRoy = j.platform_info.royalties
                  const safeRoy: any = { percentage: rawRoy.percentage }
                  if (rawRoy.enforcement_standard) safeRoy.enforcement_standard = rawRoy.enforcement_standard
                  if (typeof rawRoy.recipient_wallet === 'string') {
                    const rw = String(rawRoy.recipient_wallet)
                    if (rw.length <= MAX_METADATA_STRING) {
                      safeRoy.recipient_wallet = rw
                    } else {
                      const prefix = rw.slice(0, 12)
                      const suffix = rw.slice(-8)
                      const candidate = `${prefix}...${suffix}`
                      safeRoy.recipient_wallet = candidate.length <= MAX_METADATA_STRING ? candidate : undefined
                    }
                  }
                  ;(assetMeta as any).royalties = safeRoy
                }
              }
            } catch (e) {
              // ignore per-unit fetch errors
            }
          }
        }
      } catch (e) {
        // ignore
      }
    }

    metadata721[unitName] = assetMeta
  }

        const r = sanitizeAndReport(metadata721)
        if (r.truncated.length > 0) {
          try { console.warn('Sanitized per-unit metadata before on-chain attach:', JSON.stringify(r.truncated, null, 2)) } catch (e) {}
        }
        const tx = await lucid.newTx().mintAssets(assets).attachMintingPolicy(policy).attachMetadata(721, { [policyId]: r.value }).complete()
  // Log before signing so we can see how many sign prompts occur
  try {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[ARTI SIGN] Signing fractional single-tx for ${Object.keys(assets).length} unit(s)`)
    }
  } catch (e) {}
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

  // Dynamic batching: estimate serialized metadata size and split into safe batches.
  // Cardano node enforces transaction size limits; keep a conservative payload size per tx.
  const SAFE_METADATA_BYTES = 14_000 // leave room for other tx components
  const MAX_UNITS_PER_BATCH = batchSize || 20

  // Precompute per-unit entries and their bytes
  const unitEntries: Array<{ unitName: string; unit: Unit; meta: any; metaBytes: number }> = []
  for (let i = 1; i <= totalUnits; i++) {
    const unitName = `${safeBase}_${i}`
    debugAssetName('mintFractionalInBatches unitName', unitName)
    const unit = policyId + runtimeUtf8ToHex(unitName)

    const assetMeta = typeof cipMetadataTemplate === 'function' ? cipMetadataTemplate(i) : { ...cipMetadataTemplate }
    if (assetMeta && typeof assetMeta === 'object') {
      assetMeta.unit_index = i
      if (masterAssetIpfs) assetMeta.master_asset_ipfs = masterAssetIpfs
      try {
        if (Array.isArray((assetMeta as any).files)) {
          const passFile = (assetMeta as any).files.find((f: any) => f && f.name === 'ArtworksIDPassport' && typeof f.src === 'string')
          if (passFile) {
            const ipfsHash = String(passFile.src).replace(/^ipfs:\/\//, '')
            const gateway = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/'
            try {
              // eslint-disable-next-line no-await-in-loop
              const resp = await fetch(`${gateway}${ipfsHash}`)
              if (resp.ok) {
                // eslint-disable-next-line no-await-in-loop
                const j = await resp.json()
                if (j?.platform_info?.royalties) {
                  const rawRoy = j.platform_info.royalties
                  const safeRoy: any = { percentage: rawRoy.percentage }
                  if (rawRoy.enforcement_standard) safeRoy.enforcement_standard = rawRoy.enforcement_standard
                  if (typeof rawRoy.recipient_wallet === 'string') {
                    const rw = String(rawRoy.recipient_wallet)
                    if (rw.length <= MAX_METADATA_STRING) {
                      safeRoy.recipient_wallet = rw
                    } else {
                      const prefix = rw.slice(0, 10)
                      const suffix = rw.slice(-6)
                      const candidate = `${prefix}...${suffix}`
                      safeRoy.recipient_wallet = candidate.length <= MAX_METADATA_STRING ? candidate : undefined
                    }
                  }
                  ;(assetMeta as any).royalties = safeRoy
                }
              }
            } catch (e) {
              // ignore per-unit fetch errors
            }
          }
        }
      } catch (e) {
        // ignore
      }
    }

    const metaJson = JSON.stringify({ [policyId]: { [unitName]: assetMeta } })
    const metaBytes = (() => {
      try {
        return typeof Buffer !== 'undefined' ? Buffer.byteLength(metaJson, 'utf8') : new TextEncoder().encode(metaJson).length
      } catch (e) {
        return metaJson.length
      }
    })()

    unitEntries.push({ unitName, unit, meta: assetMeta, metaBytes })
    allUnits.push(unit)
  }

  // pack entries into batches respecting SAFE_METADATA_BYTES and MAX_UNITS_PER_BATCH
  let cursor = 0
  while (cursor < unitEntries.length) {
    let batchBytes = 0
    const assets: Record<string, bigint> = {}
    const metadata721: Record<string, any> = {}
    let count = 0

    while (cursor < unitEntries.length && count < MAX_UNITS_PER_BATCH) {
      const e = unitEntries[cursor]
      // Estimate overhead: when all units are combined, serialized JSON will include separators.
      const estimatedNext = batchBytes + e.metaBytes
      if (estimatedNext > SAFE_METADATA_BYTES && count > 0) break

      assets[e.unit] = 1n
      metadata721[e.unitName] = e.meta
      batchBytes = estimatedNext
      cursor++
      count++
    }

    const r = sanitizeAndReport(metadata721)
    if (r.truncated.length > 0) {
      try { console.warn('Sanitized batched metadata before on-chain attach:', JSON.stringify(r.truncated, null, 2)) } catch (e) {}
    }

    const tx = await lucid.newTx().mintAssets(assets).attachMintingPolicy(policy).attachMetadata(721, { [policyId]: r.value }).complete()
    try {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(`[ARTI SIGN] Signing batch tx with ${Object.keys(assets).length} unit(s) (batch ${allTxHashes.length + 1})`)
      }
    } catch (e) {}
    const signedTx = await tx.sign().complete()
    const txHash = await signedTx.submit()
    allTxHashes.push(txHash)
  }

  return { txHashes: allTxHashes, units: allUnits, policyId }
}

export const createLucid = async (): Promise<Lucid> => {
  const network = resolveNetwork(process.env.NEXT_PUBLIC_CARDANO_NETWORK)
  const projectId =
    process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID ?? process.env.BLOCKFROST_PROJECT_ID
  if (!projectId) throw new Error("Missing Blockfrost project id")
  const { Blockfrost, Lucid: LucidModule, utf8ToHex: _utf8ToHex } = await import("lucid-cardano")

  // If lucid provides utf8ToHex, expose it on globalThis so other code (or our fallback)
  // can reuse the same implementation. Only set it if not already defined.
  try {
    if (typeof _utf8ToHex === 'function' && !(globalThis as any).utf8ToHex) {
      ;(globalThis as any).utf8ToHex = _utf8ToHex
    }
  } catch (e) {
    // ignore
  }

  const blockfrost = new Blockfrost(
    process.env.NEXT_PUBLIC_BLOCKFROST_API_URL ?? "https://cardano-preprod.blockfrost.io/api/v0",
    projectId
  )

  return await LucidModule.new(blockfrost, network)
}

/**
 * Mint units using pre-pinned IPFS pointers per unit.
 * metadataPointers: Record<unitName, ipfs://CID>
 * This function builds minimal on-chain metadata where each unit references its IPFS JSON only.
 */
export const mintFractionalWithPointers = async ({
  lucid,
  address,
  policy,
  policyId,
  pointers,
}: {
  lucid: Lucid
  address: string
  policy: MintingPolicy
  policyId: string
  pointers: Record<string, string> // unitName -> ipfs://CID
}): Promise<{ txHash: TxHash; units: Unit[]; policyId: PolicyId }> => {
  if (!lucid) throw new Error('Lucid instance is required')
  if (!address) throw new Error('Wallet address is required')

  const assets: Record<string, bigint> = {}
  const metadata721: Record<string, any> = {}

  for (const unitName of Object.keys(pointers)) {
    const ipfs = pointers[unitName]
    const unit = policyId + runtimeUtf8ToHex(unitName)
    assets[unit] = 1n
    // minimal metadata per unit: small files array with ipfs pointer
    metadata721[unitName] = { files: [{ src: ipfs, mediaType: 'application/json' }] }
  }

  // Quick safety estimate: ensure combined metadata JSON won't exceed a conservative transaction size.
  // If it does, throw a descriptive error so callers can fallback to batched minting.
  try {
    const combined = JSON.stringify({ [policyId]: metadata721 })
    const combinedBytes = typeof Buffer !== 'undefined' ? Buffer.byteLength(combined, 'utf8') : new TextEncoder().encode(combined).length
    const SAFE_POINTER_METADATA_BYTES = 14_000 // same conservative limit used elsewhere
    if (combinedBytes > SAFE_POINTER_METADATA_BYTES) {
      throw new Error(`Pointer-only metadata too large for single tx: ${combinedBytes} bytes`) 
    }
  } catch (e) {
    // If our size check fails due to env constraints, still attempt safe sanitize and surface a clear error.
    const combined = JSON.stringify({ [policyId]: metadata721 })
    const combinedBytes = combined.length
    if (combinedBytes > 14000) throw new Error(`Pointer-only metadata too large (fallback to batched mint recommended). Size=${combinedBytes}`)
  }

  const r = sanitizeAndReport(metadata721)
  if (r.truncated.length > 0) {
    try { console.warn('Sanitized pointer metadata before on-chain attach:', JSON.stringify(r.truncated, null, 2)) } catch (e) {}
  }

  const tx = await lucid.newTx().mintAssets(assets).attachMintingPolicy(policy).attachMetadata(721, { [policyId]: r.value }).complete()
  try {
    if (process.env.NODE_ENV !== 'production') console.warn(`[ARTI SIGN] Signing single pointer-metadata tx for ${Object.keys(assets).length} unit(s)`)
  } catch (e) {}

  const signedTx = await tx.sign().complete()
  const txHash = await signedTx.submit()

  return { txHash, units: Object.keys(assets), policyId }
}

