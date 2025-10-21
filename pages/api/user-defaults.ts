import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

type Defaults = {
  royalties_percentage?: number
  license_type?: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'user-defaults.json')

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.access(DATA_FILE)
  } catch (err) {
    // create empty JSON
    await fs.writeFile(DATA_FILE, JSON.stringify({}), 'utf8')
  }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await ensureDataFile()

  if (req.method === 'GET') {
    const addr = String(req.query.address || '')
    if (!addr) return res.status(400).json({ error: 'address query required' })
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf8')
      const data = JSON.parse(raw || '{}') as Record<string, Defaults>
      return res.status(200).json({ address: addr, defaults: data[addr] ?? null })
    } catch (err) {
      return res.status(500).json({ error: 'failed to read defaults' })
    }
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf8')
      const data = JSON.parse(raw || '{}') as Record<string, Defaults>
      return res.status(200).json({ address: addr, defaults: data[addr] ?? null })
    } catch (err) {
      return res.status(500).json({ error: 'failed to read defaults' })
    }
  }

  if (req.method === 'POST') {
    const body = req.body || {}
    const { address, defaults } = body as { address?: string; defaults?: Defaults }
    if (!address) return res.status(400).json({ error: 'address is required' })
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf8')
      const data = JSON.parse(raw || '{}') as Record<string, Defaults>
      data[address] = { ...(data[address] || {}), ...(defaults || {}) }
      // atomic-ish write
      const tmp = DATA_FILE + '.tmp'
      await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8')
      await fs.rename(tmp, DATA_FILE)
      return res.status(200).json({ address, defaults: data[address] })
    } catch (err) {
      console.error('save defaults error', err)
      return res.status(500).json({ error: 'failed to save defaults' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
