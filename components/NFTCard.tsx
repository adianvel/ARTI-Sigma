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
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-800">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={metadata.name || "PetLog NFT"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <header>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{metadata.name}</h3>
          <p className="break-all text-xs text-slate-500 dark:text-slate-400">{assetId}</p>
        </header>

        {metadata.description && (
          <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{metadata.description}</p>
        )}

        {metadata.attributes && metadata.attributes.length > 0 && (
          <dl className="grid grid-cols-2 gap-2 text-xs text-slate-500">
            {metadata.attributes.map((attr, index) => (
              <div
                key={`${attr.trait_type}-${index}`}
                className="rounded border border-slate-200 px-2 py-1 dark:border-slate-700"
              >
                <dt className="font-medium text-slate-600 dark:text-slate-400">{attr.trait_type}</dt>
                <dd className="text-slate-900 dark:text-slate-100">{attr.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <footer className="mt-auto rounded border border-blue-100 bg-blue-50 p-2 text-xs text-blue-700 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-200">
          <div>Policy</div>
          <div className="break-all font-mono text-[11px]">{policyId}</div>
        </footer>
      </div>
    </article>
  )
}
