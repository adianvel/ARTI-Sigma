import type { NextApiRequest, NextApiResponse } from "next"
import pinataSDK from "@pinata/sdk"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).json({ error: "Method not allowed" })
  }

  const pinataKey = process.env.PINATA_API_KEY
  const pinataSecret = process.env.PINATA_API_SECRET
  if (!pinataKey || !pinataSecret) {
    return res.status(500).json({ error: "Pinata credentials are not configured." })
  }

  try {
    const body = req.body
    if (!body) return res.status(400).json({ error: "Missing passport JSON in request body" })

  const pinata = new pinataSDK(pinataKey, pinataSecret)
    const result = await pinata.pinJSONToIPFS(body, {
      pinataMetadata: { name: `ARTI_Passport_${Date.now()}` },
    })

    return res.status(200).json({ ipfsHash: result.IpfsHash })
  } catch (err) {
    console.error("Pin passport API error", err)
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    const payload: any = { error: message }
    if (process.env.NODE_ENV !== 'production') payload.stack = stack
    return res.status(500).json(payload)
  }
}
