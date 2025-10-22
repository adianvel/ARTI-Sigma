import type { NextApiRequest, NextApiResponse } from "next"
import formidable from "formidable"
import fs from "fs"
import pinataSDK from "@pinata/sdk"
import { ArtMedium, ArtPieceMetadata } from "../../types/passport"

export const config = {
  api: {
    bodyParser: false,
  },
}

const getFieldValue = (fields: formidable.Fields, name: string): string | undefined => {
  const value = fields[name]
  const raw = Array.isArray(value) ? (value[0] as string) : (value as string | undefined)
  if (typeof raw === 'string') return raw.trim()
  return undefined
}

const toSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_")

type ValidateResult =
  | { ok: true }
  | { ok: false; reason: 'missing'; missing: string[] }
  | { ok: false; reason: 'invalid_medium'; allowed: ArtMedium[] }

const validateForm = (form: Record<string, string>): ValidateResult => {
  const required = ["title", "artist_name", "description", "medium"]
  const missing = required.filter((field) => !(form[field] && String(form[field]).trim()))
  if (missing.length > 0) {
    return { ok: false, reason: 'missing', missing }
  }

  const allowedMediums: ArtMedium[] = ["3D Animation", "Video Art", "Generative Art"]
  if (!allowedMediums.includes((form.medium || '') as ArtMedium)) {
    return { ok: false, reason: 'invalid_medium', allowed: allowedMediums }
  }

  return { ok: true }
}

const ensureFile = (file?: formidable.File | formidable.File[]) => {
  if (!file) {
    throw new Error("Media file is required")
  }
  return Array.isArray(file) ? file[0] : file
}

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

  const form = formidable({ multiples: false, keepExtensions: false })

  try {
    const { fields, files } =
      await new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
        (resolve, reject) => {
          form.parse(req, (err, parsedFields, parsedFiles) => {
            if (err) reject(err)
            else resolve({ fields: parsedFields, files: parsedFiles })
          })
        }
      )

    // Validate presence of uploaded file
    if (!files || !files.asset) {
      return res.status(422).json({ error: 'validation', reason: 'missing_file', message: 'Primary media file is required' })
    }

    const assetFile = ensureFile(files.asset)

    if (!assetFile.filepath) {
      return res.status(422).json({ error: 'validation', reason: 'invalid_file', message: 'Uploaded file is invalid or unreadable' })
    }

    const formValues: Record<string, string> = {
      title: getFieldValue(fields, "title") ?? "",
      artist_name: getFieldValue(fields, "artist_name") ?? "",
      description: getFieldValue(fields, "description") ?? "",
      // short description intended for on-chain metadata (<=64 chars)
      description_short: getFieldValue(fields, "description_short") ?? "",
      medium: getFieldValue(fields, "medium") ?? "",
      edition: getFieldValue(fields, "edition") ?? "",
      duration_or_dimensions: getFieldValue(fields, "duration_or_dimensions") ?? "",
    }

    const v = validateForm(formValues)
    if (!v.ok) {
      if (v.reason === 'missing') {
        return res.status(422).json({ error: 'validation', reason: 'missing_fields', missing: v.missing })
      }
      if (v.reason === 'invalid_medium') {
        return res.status(422).json({ error: 'validation', reason: 'invalid_medium', allowed: v.allowed })
      }
      return res.status(422).json({ error: 'validation', reason: 'invalid', details: v })
    }

    // server-side validation for optional license fields.
    const components: Record<string, string> = {}

    // Support two shapes from the client:
    // 1) flat form fields: license_url, license_type
    // 2) nested JSON field: license -> { license_url, license_type }
    let licenseUrl = getFieldValue(fields, 'license_url')
    let licenseType = getFieldValue(fields, 'license_type')
    const licenseJson = getFieldValue(fields, 'license')
    if (licenseJson) {
      try {
        const parsed = JSON.parse(licenseJson)
        if (parsed && typeof parsed === 'object') {
          if (parsed.license_url && !licenseUrl) licenseUrl = String(parsed.license_url)
          if (parsed.license_type && !licenseType) licenseType = String(parsed.license_type)
        }
      } catch (e) {
        // ignore JSON parse errors and fall back to flat fields
      }
    }

    if (licenseUrl) {
      try {
        // will throw if invalid
        // @ts-ignore - URL exists in node
        new URL(licenseUrl)
      } catch (e) {
        components['license_url'] = 'Invalid URL'
      }
    }

    if (Object.keys(components).length > 0) {
      return res.status(422).json({ error: 'validation', reason: 'invalid_fields', components })
    }

  const pinata = new pinataSDK(pinataKey, pinataSecret)
    const slug = toSlug(formValues.title || "arti_sigma_piece")

    const assetStream = fs.createReadStream(assetFile.filepath)
    const mediaType = assetFile.mimetype || "application/octet-stream"
    const assetUpload = await pinata.pinFileToIPFS(assetStream, {
      pinataMetadata: {
        name: `ARTI_Asset_${slug}`,
      },
    })

    const artPiece: ArtPieceMetadata & { description_short?: string; royalties?: { percentage: number; recipient?: string }; license?: { license_type?: string; license_url?: string } } = {
      title: formValues.title,
      artist_name: formValues.artist_name,
      description: formValues.description,
      description_short: formValues.description_short || undefined,
      medium: formValues.medium as ArtMedium,
      file_url: `ipfs://${assetUpload.IpfsHash}`,
      edition: formValues.edition || undefined,
      duration_or_dimensions: formValues.duration_or_dimensions || undefined,
    }

    // Attach optional royalties info when provided in the form (keeps metadata aligned with passport)
    try {
      const royRaw = getFieldValue(fields, 'royalties_percentage')
      if (royRaw) {
        const p = Number(royRaw)
        if (!Number.isNaN(p) && p >= 0 && p <= 100) {
          ;(artPiece as any).royalties = { percentage: p }
          // recipient wallet will be set by the client to the connected account address (no form input expected)
          // But if a recipient_wallet is explicitly provided, validate it.
          const recip = getFieldValue(fields, 'recipient_wallet')
          if (recip) {
            const r = String(recip).trim()
            const bech32Like = /^(addr1|addr_test1)[0-9a-z]+$/i
            if (!bech32Like.test(r) || r.length > 200) {
              return res.status(422).json({ error: 'validation', reason: 'invalid_recipient_wallet' })
            }
            ;(artPiece as any).royalties.recipient = r
          }
        }
      }
    } catch (e) {
      // ignore optional royalties parsing errors
    }

    // Attach license info if available
    try {
      if (licenseUrl || licenseType) {
        ;(artPiece as any).license = { license_type: licenseType, license_url: licenseUrl }
      }
    } catch (e) {
      // ignore
    }

    const metadataUpload = await pinata.pinJSONToIPFS(artPiece, {
      pinataMetadata: {
        name: `ARTI_Metadata_${slug}`,
      },
    })

    return res.status(200).json({
      asset: assetUpload.IpfsHash,
      metadata: metadataUpload.IpfsHash,
      mediaType,
      description_short: formValues.description_short || undefined,
    })
  } catch (error) {
    console.error("Mint asset API error", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    const stack = error instanceof Error ? error.stack : undefined
    const payload: any = { error: message }
    if (process.env.NODE_ENV !== 'production') payload.stack = stack
    return res.status(500).json(payload)
  }
}
