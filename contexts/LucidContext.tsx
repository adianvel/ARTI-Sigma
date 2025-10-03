import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { Network } from "lucid-cardano"

interface WalletAccount {
  address: string
  rewardAddress?: string | null
}

interface LucidContextState {
  lucid: any | null
  account: WalletAccount | null
  connect: (walletName: string) => Promise<void>
  disconnect: () => void
  isReady: boolean
  network: Network
}

const BLOCKFROST_API_URL =
  process.env.NEXT_PUBLIC_BLOCKFROST_API_URL ?? "https://cardano-preprod.blockfrost.io/api/v0"

const BLOCKFROST_PROJECT_ID =
  process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID ?? process.env.BLOCKFROST_PROJECT_ID ?? ""

const resolveNetwork = (value?: string | null): Network => {
  const normalized = value?.trim()

  switch (normalized) {
    case "Mainnet":
    case "Testnet":
    case "Preview":
    case "Preprod":
      return normalized
    default:
      if (normalized) {
        console.warn(
          `Unsupported NEXT_PUBLIC_CARDANO_NETWORK value "${normalized}", defaulting to "Preprod"`
        )
      }
      return "Preprod"
  }
}

const CARDANO_NETWORK: Network = resolveNetwork(process.env.NEXT_PUBLIC_CARDANO_NETWORK)

const LucidContext = createContext<LucidContextState>({
  lucid: null,
  account: null,
  connect: async () => {},
  disconnect: () => {},
  isReady: false,
  network: CARDANO_NETWORK,
})

export const LucidProvider = ({ children }: { children: React.ReactNode }) => {
  const [lucid, setLucid] = useState<any | null>(null)
  const [account, setAccount] = useState<WalletAccount | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initializeLucid = async () => {
      if (!BLOCKFROST_PROJECT_ID) {
        console.error("Missing NEXT_PUBLIC_BLOCKFROST_PROJECT_ID or BLOCKFROST_PROJECT_ID env var")
        setIsReady(true)
        return
      }

      try {
        const { Lucid, Blockfrost } = await import("lucid-cardano")
        const lucidInstance = await Lucid.new(
          new Blockfrost(BLOCKFROST_API_URL, BLOCKFROST_PROJECT_ID),
          CARDANO_NETWORK
        )
        setLucid(lucidInstance)
      } catch (error) {
        console.error("Failed to initialise Lucid", error)
      } finally {
        setIsReady(true)
      }
    }

    initializeLucid()
  }, [])

  const connect = useCallback(
    async (walletName: string) => {
      if (!lucid) {
        throw new Error("Lucid instance not ready")
      }

      const cardano = (window as any)?.cardano
      if (!cardano || !cardano[walletName]) {
        throw new Error(`Wallet ${walletName} is not installed or not exposed on window.cardano`)
      }

      const walletApi = await cardano[walletName].enable()
      await lucid.selectWallet(walletApi)

      const [address, rewardAddress] = await Promise.all([
        lucid.wallet.address(),
        lucid.wallet.rewardAddress().catch(() => null),
      ])

      setAccount({ address, rewardAddress })
    },
    [lucid]
  )

  const disconnect = useCallback(() => {
    setAccount(null)
  }, [])

  const value = useMemo(
    () => ({ lucid, account, connect, disconnect, isReady, network: CARDANO_NETWORK }),
    [lucid, account, connect, disconnect, isReady]
  )

  return <LucidContext.Provider value={value}>{children}</LucidContext.Provider>
}

export const useLucid = () => useContext(LucidContext)
