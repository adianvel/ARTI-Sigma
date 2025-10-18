export const ipfsToGateway = (url: string | null | undefined) => {
  if (!url) return null
  if (!url.startsWith("ipfs://")) return url
  const stripped = url.replace("ipfs://", "").replace(/^ipfs\//i, "")
  const gateway =
    process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "https://purple-persistent-booby-135.mypinata.cloud/ipfs/"
  return `${gateway}${stripped}`
}
