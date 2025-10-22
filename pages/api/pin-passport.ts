import type { NextApiRequest, NextApiResponse } from "next"
import pinataSDK from "@pinata/sdk"
import fs from "fs"
import path from "path"

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
    if (!body) return res.status(400).json({ error: 'Missing passport JSON in request body' })

    // If this looks like a passport (has platform_info), require platform_info.royalties
    try {
      if (body?.platform_info) {
        const royalties = body.platform_info?.royalties
        const hasPercentage = typeof royalties?.percentage === 'number' && !Number.isNaN(royalties.percentage) && royalties.percentage >= 0 && royalties.percentage <= 100
        const hasRecipient = typeof royalties?.recipient_wallet === 'string' && royalties.recipient_wallet.trim().length > 0
        if (!hasPercentage || !hasRecipient) {
          return res.status(400).json({ error: 'Passport must include platform_info.royalties with percentage (0-100) and recipient_wallet (non-empty)' })
        }

        // Basic bech32-like Cardano address check to avoid extremely long or malformed strings.
        const recipient = String(royalties.recipient_wallet).trim()
        const bech32Like = /^(addr1|addr_test1)[0-9a-z]+$/i
        if (!bech32Like.test(recipient) || recipient.length > 200) {
          return res.status(422).json({ error: 'Invalid recipient_wallet format in passport.platform_info.royalties' })
        }
      }
    } catch (e) {
      return res.status(400).json({ error: 'Passport royalties validation failed' })
    }

    const pinata = new pinataSDK(pinataKey, pinataSecret)
    const result = await pinata.pinJSONToIPFS(body, {
      pinataMetadata: { name: `ARTI_Passport_${Date.now()}` },
    })

    // If this passport contains a minting_record, persist a mapping so the frontend
    // can later resolve the issued passport CID without blocking the mint flow.
    try {
      const mint = body?.minting_record
      if (mint && (mint.txHash || mint.units)) {
        const storeDir = path.join(process.cwd(), "data")
        const storeFile = path.join(storeDir, "issued-passports.json")
        await fs.promises.mkdir(storeDir, { recursive: true })
        let existing: Array<any> = []
        try {
          const raw = await fs.promises.readFile(storeFile, "utf8")
          existing = JSON.parse(raw)
        } catch (e) {
          existing = []
        }

        const entry = {
          txHash: mint.txHash ?? null,
          units: Array.isArray(mint.units) ? mint.units : mint.units ? [mint.units] : [],
          ipfsHash: result.IpfsHash,
          pinned_at: new Date().toISOString(),
        }

        existing.push(entry)
        await fs.promises.writeFile(storeFile, JSON.stringify(existing, null, 2), "utf8")
      }
    } catch (e) {
      // ignore persisting errors - we still return the pin result
      console.warn("Failed to persist issued passport mapping", e)
    }

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
