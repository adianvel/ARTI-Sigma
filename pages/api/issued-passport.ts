import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { tx, unit } = req.query
  const storeFile = path.join(process.cwd(), 'data', 'issued-passports.json')

  try {
    const raw = await fs.promises.readFile(storeFile, 'utf8')
    const list = JSON.parse(raw) as Array<any>

    if (tx && typeof tx === 'string') {
      const found = list.find((e) => e.txHash === tx)
      if (found) return res.status(200).json({ ipfsHash: found.ipfsHash })
      return res.status(404).json({ error: 'Not found' })
    }

    if (unit && typeof unit === 'string') {
      const found = list.find((e) => Array.isArray(e.units) && e.units.includes(unit))
      if (found) return res.status(200).json({ ipfsHash: found.ipfsHash })
      return res.status(404).json({ error: 'Not found' })
    }

    return res.status(400).json({ error: 'Provide tx or unit query parameter' })
  } catch (e) {
    return res.status(404).json({ error: 'Not found' })
  }
}
