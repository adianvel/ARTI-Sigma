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
  policyId: string
}

const resolveIpfsUrl = (ipfsUrl: string): string | null => {
  if (!ipfsUrl || !ipfsUrl.startsWith("ipfs://")) {
    return null
  }

  const cid = ipfsUrl.replace("ipfs://", "")
  const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "https://purple-persistent-booby-135.mypinata.cloud/ipfs/"
  return `${gateway}${cid}`
}

export const NFTCard = ({ metadata, assetId, policyId }: NFTCardProps) => {
  const imageUrl = resolveIpfsUrl(metadata.image)

  return (
    <article className="pixel-card flex h-full flex-col bg-pl-card">
      <div className="relative aspect-square w-full overflow-hidden border-b border-pl-borderStrong bg-pl-surface">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={metadata.name || "PetLog NFT"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-pl-muted">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <header className="space-y-1">
          <h3 className="font-display text-xl tracking-[0.18em] text-pl-heading">{metadata.name}</h3>
          <p className="break-all text-xs font-mono uppercase tracking-[0.3em] text-pl-muted">{assetId}</p>
        </header>

        {metadata.description && (
          <p className="text-sm leading-relaxed text-pl-body">{metadata.description}</p>
        )}

        {metadata.attributes && metadata.attributes.length > 0 && (
          <dl className="grid grid-cols-2 gap-2 text-sm uppercase tracking-[0.2em] text-pl-muted">
            {metadata.attributes.map((attr, index) => (
              <div
                key={`${attr.trait_type}-${index}`}
                className="rounded-pixel border border-pl-borderStrong bg-pl-background px-2 py-2"
              >
                <dt className="text-xs uppercase tracking-[0.3em] text-pl-muted">{attr.trait_type}</dt>
                <dd className="mt-1 font-semibold text-pl-heading">{attr.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <footer className="mt-auto rounded-pixel border border-pl-border bg-pl-highlight p-2 text-sm uppercase tracking-[0.25em] text-pl-heading">
          <div>Policy</div>
          <div className="mt-1 break-all font-mono text-xs">{policyId}</div>
        </footer>
      </div>
    </article>
  )
}


