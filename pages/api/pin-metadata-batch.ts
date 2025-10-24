import type { NextApiRequest, NextApiResponse } from "next"
import pinataSDK from "@pinata/sdk"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const pinataKey = process.env.PINATA_API_KEY
  const pinataSecret = process.env.PINATA_API_SECRET
  if (!pinataKey || !pinataSecret) {
    return res.status(500).json({ error: 'Pinata credentials are not configured.' })
  }

  try {
    const body = req.body
    if (!body || !Array.isArray(body)) return res.status(400).json({ error: 'Expected an array of JSON objects in request body' })

    const pinata = new pinataSDK(pinataKey, pinataSecret)
    const results: Array<{ index: number; IpfsHash?: string; error?: string }> = []

    for (let i = 0; i < body.length; i++) {
      try {
        const obj = body[i]
        const name = obj?.art_piece?.title ? `ARTI_Metadata_${obj.art_piece.title}_${i}` : `ARTI_Metadata_${Date.now()}_${i}`
        // pin JSON
        // Note: pinata may throttle; for large batches consider pin as folder or chunking
        // but here we pin items sequentially for simplicity.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const r = await pinata.pinJSONToIPFS(obj, { pinataMetadata: { name } })
        results.push({ index: i, IpfsHash: r.IpfsHash })
      } catch (e: any) {
        results.push({ index: i, error: e?.message ?? String(e) })
      }
    }

    return res.status(200).json({ results })
  } catch (err: any) {
    console.error('pin-metadata-batch error', err)
    return res.status(500).json({ error: err?.message ?? String(err) })
  }
}
