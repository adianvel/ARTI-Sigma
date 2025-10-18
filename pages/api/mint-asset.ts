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
  if (Array.isArray(value)) return value[0] as string
  return value as string | undefined
}

const toSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_")

const validateForm = (form: Record<string, string>) => {
  const required = [
    "title",
    "artist_name",
    "description",
    "medium",
  ]

  const missing = required.filter((field) => !form[field])
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`)
  }

  const allowedMediums: ArtMedium[] = ["3D Animation", "Video Art", "Generative Art"]
  if (!allowedMediums.includes(form.medium as ArtMedium)) {
    throw new Error(`Medium must be one of: ${allowedMediums.join(", ")}`)
  }
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

    const assetFile = ensureFile(files.asset)

    if (!assetFile.filepath) {
      return res.status(400).json({ error: "Uploaded files are invalid." })
    }

    const formValues: Record<string, string> = {
      title: getFieldValue(fields, "title") ?? "",
      artist_name: getFieldValue(fields, "artist_name") ?? "",
      description: getFieldValue(fields, "description") ?? "",
      medium: getFieldValue(fields, "medium") ?? "",
      edition: getFieldValue(fields, "edition") ?? "",
      duration_or_dimensions: getFieldValue(fields, "duration_or_dimensions") ?? "",
    }

    validateForm(formValues)

    const pinata = new pinataSDK(pinataKey, pinataSecret)
    const slug = toSlug(formValues.title || "arti_sigma_piece")

    const assetStream = fs.createReadStream(assetFile.filepath)
    const mediaType = assetFile.mimetype || "application/octet-stream"
    const assetUpload = await pinata.pinFileToIPFS(assetStream, {
      pinataMetadata: {
        name: `ARTI_Asset_${slug}`,
      },
    })

    const artPiece: ArtPieceMetadata = {
      title: formValues.title,
      artist_name: formValues.artist_name,
      description: formValues.description,
      medium: formValues.medium as ArtMedium,
      file_url: `ipfs://${assetUpload.IpfsHash}`,
      edition: formValues.edition || undefined,
      duration_or_dimensions: formValues.duration_or_dimensions || undefined,
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
    })
  } catch (error) {
    console.error("Mint asset API error", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return res.status(500).json({ error: message })
  }
}
