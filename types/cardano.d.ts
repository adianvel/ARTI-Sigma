declare global {
  interface Window {
    cardano?: {
      eternl?: {
        enable: () => Promise<{
          getUsedAddresses: () => Promise<string[]>
        }>
      }
    }
  }
}

export {}
