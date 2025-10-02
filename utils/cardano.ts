const HEX_REGEX = /^[0-9a-fA-F]+$/

const asciiToHex = (value: string) =>
  Array.from(value)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("")

export const normalizeAssetUnit = (rawUnit: string, policyId?: string): string => {
  if (!rawUnit) return rawUnit

  const trimmed = rawUnit.trim()
  if (!trimmed) return trimmed

  if (HEX_REGEX.test(trimmed) && trimmed.length >= 56) {
    return trimmed.toLowerCase()
  }

  if (trimmed.includes(".")) {
    const [policy, ...nameParts] = trimmed.split(".")
    const assetName = nameParts.join(".")
    if (policy.length === 56) {
      const normalizedName = HEX_REGEX.test(assetName) ? assetName : asciiToHex(assetName)
      return `${policy}${normalizedName}`.toLowerCase()
    }
  }

  if (policyId && trimmed.startsWith(policyId)) {
    const suffix = trimmed.slice(policyId.length)
    if (!HEX_REGEX.test(suffix) || suffix.length % 2 !== 0) {
      return `${policyId}${asciiToHex(suffix)}`.toLowerCase()
    }
    return trimmed.toLowerCase()
  }

  if (!HEX_REGEX.test(trimmed) || trimmed.length % 2 !== 0) {
    return asciiToHex(trimmed).toLowerCase()
  }

  return trimmed.toLowerCase()
}
