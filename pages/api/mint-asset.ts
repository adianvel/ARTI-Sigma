import type { NextApiRequest, NextApiResponse } from "next"
import formidable from "formidable"
import fs from "fs"
import pinataSDK from "@pinata/sdk"
import { DigitalPetPassport } from "../../types/passport"

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

const buildMetadata = (form: Record<string, string>, imageCid: string): DigitalPetPassport => {
  return {
    identity: {
      cat_name: form.cat_name,
      date_of_birth: form.date_of_birth,
    },
    attributes: {
      breed: form.breed,
      coat_color: form.coat_color,
      sex: form.sex as "Male" | "Female",
    },
    unique_identification: {
      microchip_number: form.microchip_number,
    },
    provenance:
      form.sire_name || form.dam_name
        ? {
            sire_name: form.sire_name || undefined,
            dam_name: form.dam_name || undefined,
          }
        : undefined,
    platform_info: {
      image_url: `ipfs://${imageCid}`,
      validation_tier: "Level 1 - Self Attested",
      minted_on: new Date().toISOString(),
      application_version: "1.0",
    },
  }
}

const validateForm = (form: Record<string, string>) => {
  const required = [
    "cat_name",
    "date_of_birth",
    "breed",
    "coat_color",
    "sex",
    "microchip_number",
  ]

  const missing = required.filter((field) => !form[field])
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`)
  }
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
    const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req, (err, parsedFields, parsedFiles) => {
        if (err) reject(err)
        else resolve({ fields: parsedFields, files: parsedFiles })
      })
    })

    const imageFile = files.image
    const file = Array.isArray(imageFile) ? imageFile[0] : imageFile
    if (!file || !file.filepath) {
      return res.status(400).json({ error: "Image file is required" })
    }

    const formValues: Record<string, string> = {
      cat_name: getFieldValue(fields, "cat_name") ?? "",
      date_of_birth: getFieldValue(fields, "date_of_birth") ?? "",
      breed: getFieldValue(fields, "breed") ?? "",
      coat_color: getFieldValue(fields, "coat_color") ?? "",
      sex: getFieldValue(fields, "sex") ?? "",
      microchip_number: getFieldValue(fields, "microchip_number") ?? "",
      sire_name: getFieldValue(fields, "sire_name") ?? "",
      dam_name: getFieldValue(fields, "dam_name") ?? "",
    }

    validateForm(formValues)

    const pinata = new pinataSDK(pinataKey, pinataSecret)

    const imageStream = fs.createReadStream(file.filepath)
    const imageUpload = await pinata.pinFileToIPFS(imageStream, {
      pinataMetadata: {
        name: `PetLog_Image_${formValues.cat_name}`,
      },
    })

    const metadata = buildMetadata(formValues, imageUpload.IpfsHash)
    const metadataUpload = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: {
        name: `PetLog_Metadata_${formValues.cat_name}`,
      },
    })

    return res.status(200).json({ image: imageUpload.IpfsHash, metadata: metadataUpload.IpfsHash })
  } catch (error) {
    console.error("Mint asset API error", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return res.status(500).json({ error: message })
  }
}
