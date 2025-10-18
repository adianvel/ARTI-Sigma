import Image from "next/image"

interface NFTAttribute {
  trait_type: string
  value: string
}

interface NFTMetadata {
  name: string
  image: string
  description: string
  attributes?: NFTAttribute[]
}

interface NFTCardProps {
  metadata: NFTMetadata
  assetId: string
}

const resolveIpfsUrl = (ipfsUrl: string): string | null => {
  if (!ipfsUrl || !ipfsUrl.startsWith("ipfs://")) {
    return null
  }

  const cid = ipfsUrl.replace("ipfs://", "")
  const gateway =
    process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "https://purple-persistent-booby-135.mypinata.cloud/ipfs/"

  return `${gateway}${cid}`
}

export const NFTCard = ({ metadata, assetId }: NFTCardProps) => {
  const imageUrl = resolveIpfsUrl(metadata.image)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[20px] border border-as-border bg-as-surface/70 shadow-pixel transition-all duration-300 hover:-translate-y-1 hover:border-as-borderStrong/50">
      <div className="relative aspect-square w-full overflow-hidden bg-as-highlight/20">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={metadata.name || "Arti showcase"}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-as-muted">
            <div className="text-center text-[0.7rem] uppercase tracking-[0.3em]">
              No thumbnail
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <header className="space-y-2">
          <h3 className="text-lg font-semibold text-as-heading">
            {metadata.name || "Untitled Arti Piece"}
          </h3>
          <p className="break-all text-[0.6rem] font-mono uppercase tracking-[0.35em] text-as-muted">
            {assetId}
          </p>
        </header>

        {metadata.description && (
          <p className="text-sm leading-relaxed text-as-muted">{metadata.description}</p>
        )}

        {metadata.attributes && metadata.attributes.length > 0 && (
          <dl className="grid grid-cols-2 gap-3">
            {metadata.attributes.map((attr, index) => (
              <div
                key={`${attr.trait_type}-${index}`}
                className="rounded-[14px] border border-as-border bg-as-highlight/30 p-3 text-[0.6rem] uppercase tracking-[0.3em] text-as-muted"
              >
                <dt>{attr.trait_type}</dt>
                <dd className="mt-2 text-as-heading">{attr.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  )
}
