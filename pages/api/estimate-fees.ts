import type { NextApiRequest, NextApiResponse } from 'next'
import { createLucid } from '../../lib/minting-utils'

type EstReq = {
  sizeBytes?: number
  royaltyPercent?: number
  totalUnits?: number
}

type EstRes = {
  sizeMB: number
  pinCostAda: number
  mintFeeAda: number
  estimatedTotalAda: number
  details?: any
}

const lovelaceToAda = (lovelace: number) => Number((lovelace / 1_000_000).toFixed(6))

export default async function handler(req: NextApiRequest, res: NextApiResponse<EstRes | { error: string }>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = (req.body || {}) as EstReq
  const sizeBytes = typeof body.sizeBytes === 'number' ? body.sizeBytes : 0
  const royalty = typeof body.royaltyPercent === 'number' ? body.royaltyPercent : 5
  const totalUnits = typeof body.totalUnits === 'number' ? Math.max(1, Math.floor(body.totalUnits)) : 1

  const sizeMB = Math.max(1, Math.round(sizeBytes / 1024 / 1024))

  // Pin cost model (server-side)
  const pinPerMB = 0.0018 // ADA per MB (placeholder)
  const pinCostAda = Number((sizeMB * pinPerMB).toFixed(6))

  // Try to build a Lucid tx to get a realistic fee estimate when Blockfrost config is present
  try {
    const lucid = await createLucid()

    // Build a simple mint transaction to let Lucid compute size-based fee approximations.
    // We derive a policy from the address provided in the request (if any) or from the first address available via Lucid.
    const assets: Record<string, bigint> = {}
    const safeBase = 'ARTI_ESTIMATE'

    // Attempt to get a usable address from Lucid context
    let sampleAddress = process.env.ESTIMATE_SAMPLE_ADDRESS || ''
    try {
      // try to obtain any address from Lucid wallet or chain (silently)
      const addrDetails = lucid.utils.getAddressDetails(sampleAddress || '')
      if (!addrDetails || !addrDetails.paymentCredential?.hash) {
        // Try to use NEXT_PUBLIC_BLOCKFROST_PROJECT_ID presence as a hint; if not available we'll throw below
        // We cannot reliably derive a live wallet address server-side; rely on a configured sample address via env or fall back.
      }
    } catch (e) {
      // ignore
    }

    // Use utf8 hex helper
    const utf8ToHex = (s: string) => Buffer.from(s, 'utf8').toString('hex')
    for (let i = 1; i <= totalUnits; i++) {
      const unitName = `${safeBase}_${i}`
      // we don't need a real policy id for fee estimation — use a placeholder hex string to mimic size
      const unit = 'f'.repeat(56) + utf8ToHex(unitName)
      assets[unit] = 1n
    }

    // Attach mint assets and minimal metadata
    const tx = await lucid.newTx().mintAssets(assets).attachMetadata(721, { mock: { foo: 'bar' } }).complete()

    // Lucid does not provide a simple public API to extract exact fee from TxComplete without signing.
    // However, the constructed tx size and attached metadata give us a reasonable basis. We'll compute a heuristic
    // fee from tx.serializedSize approximation if available, otherwise use per-unit heuristic.
    let mintFeeAda: number
    // Try to use a size heuristic from the tx object
    // @ts-ignore
    const approxSize = (tx as any)?.size || undefined
    if (approxSize && typeof approxSize === 'number') {
      // Derive lovelace fee estimate from size: base fee + linear factor (heuristic)
      const baseLovelace = 500_000
      const perByte = 44 // lovelace per byte heuristic
      const estLovelace = baseLovelace + perByte * approxSize
      mintFeeAda = lovelaceToAda(estLovelace)
    } else {
      const baseMintFee = 0.95
      const perUnit = 0.03
      const royaltySurcharge = Math.min(0.5, Math.max(0, royalty / 1000))
      mintFeeAda = Number((baseMintFee + perUnit * totalUnits + royaltySurcharge).toFixed(6))
    }

    const estimatedTotalAda = Number((pinCostAda + mintFeeAda).toFixed(6))

    return res.status(200).json({ sizeMB, pinCostAda, mintFeeAda, estimatedTotalAda, details: { totalUnits } })
  } catch (err) {
    // Fallback placeholder model when Lucid/Blockfrost not available
    const baseMintFee = 0.95 // ADA
    const perUnit = 0.03
    const royaltySurcharge = Math.min(0.5, Math.max(0, royalty / 1000))

    const mintFeeAda = Number((baseMintFee + perUnit * (totalUnits || 1) + royaltySurcharge).toFixed(6))
    const estimatedTotalAda = Number((pinCostAda + mintFeeAda).toFixed(6))

    return res.status(200).json({ sizeMB, pinCostAda, mintFeeAda, estimatedTotalAda })
  }
}
