import Link from "next/link"
import { NFTCard } from "./NFTCard"
import { DigitalPetPassport } from "../types/passport"

interface PassportCardProps {
  assetId: string
  policyId: string
  metadata: DigitalPetPassport
}

export const PassportCard = ({ assetId, policyId, metadata }: PassportCardProps) => {
  const nftMetadata = {
    name: metadata.identity.cat_name,
    image: metadata.platform_info.image_url,
    description: `Digital passport for ${metadata.identity.cat_name}`,
    attributes: [
      { trait_type: "Breed", value: metadata.attributes.breed },
      { trait_type: "Coat", value: metadata.attributes.coat_color },
      { trait_type: "Sex", value: metadata.attributes.sex },
    ],
  }

  return (
    <Link
      href={`/passport/${assetId}`}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <NFTCard assetId={assetId} policyId={policyId} metadata={nftMetadata} />
    </Link>
  )
}
