import type { NextApiRequest, NextApiResponse } from "next"

const API_URL =
  process.env.BLOCKFROST_API_URL ??
  process.env.NEXT_PUBLIC_BLOCKFROST_API_URL ??
  "https://cardano-preprod.blockfrost.io/api/v0"

const PROJECT_ID =
  process.env.BLOCKFROST_PROJECT_ID ??
  process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID ??
  ""

const removeHopByHopHeaders = (headers: Headers) => {
  const result: Record<string, string> = {}
  headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (["content-encoding", "transfer-encoding", "content-length"].includes(lower)) {
      return
    }
    result[key] = value
  })
  return result
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!PROJECT_ID) {
    return res.status(500).json({ error: "Blockfrost project id is not configured" })
  }

  const segments = Array.isArray(req.query.all)
    ? req.query.all
    : typeof req.query.all === "string"
    ? [req.query.all]
    : []

  const baseOverrideRaw = Array.isArray(req.query.base) ? req.query.base[0] : req.query.base
  const targetBase = (baseOverrideRaw && typeof baseOverrideRaw === "string"
    ? baseOverrideRaw
    : API_URL
  ).replace(/\/$/, "")

  const searchParams = new URLSearchParams()
  Object.entries(req.query).forEach(([key, value]) => {
    if (key === "all" || key === "base") {
      return
    }
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry !== undefined) {
          searchParams.append(key, entry)
        }
      })
    } else if (value !== undefined) {
      searchParams.append(key, value)
    }
  })

  const queryString = searchParams.toString()
  const path = segments.join("/")
  const targetUrl = `${targetBase}/${path}${queryString ? `?${queryString}` : ""}`

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: {
        project_id: PROJECT_ID,
        Authorization: `Bearer ${PROJECT_ID}`,
      },
      body:
        req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS"
          ? undefined
          : (req.body as any),
    })

    const buffer = Buffer.from(await upstream.arrayBuffer())
    const headers = removeHopByHopHeaders(upstream.headers)

    res.writeHead(upstream.status, headers)
    res.end(buffer)
  } catch (error) {
    console.error("Blockfrost proxy error", error)
    res.status(500).json({ error: "Failed to reach Blockfrost", details: error instanceof Error ? error.message : String(error) })
  }
}
