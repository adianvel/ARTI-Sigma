import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { Lucid, Network } from "lucid-cardano"

interface WalletAccount {
  address: string
  rewardAddress?: string | null
}

interface LucidContextState {
  lucid: Lucid | null
  account: WalletAccount | null
  connect: (walletName: string) => Promise<void>
  disconnect: () => void
  isReady: boolean
  network: Network
  initializationError: string | null
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
  initializationError: null,
})

export const LucidProvider = ({ children }: { children: React.ReactNode }) => {
  const [lucid, setLucid] = useState<Lucid | null>(null)
  const [account, setAccount] = useState<WalletAccount | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [initializationError, setInitializationError] = useState<string | null>(null)
  const initializationPromise = useRef<Promise<Lucid> | null>(null)

  const initializeLucid = useCallback(async (): Promise<Lucid> => {
    if (lucid) {
      return lucid
    }

    if (initializationPromise.current) {
      return initializationPromise.current
    }

    if (!BLOCKFROST_PROJECT_ID) {
      const message = "Missing NEXT_PUBLIC_BLOCKFROST_PROJECT_ID or BLOCKFROST_PROJECT_ID env var. Set NEXT_PUBLIC_BLOCKFROST_PROJECT_ID in your environment."
      console.error(message)
      setInitializationError(message)
      setIsReady(true)
      throw new Error(message)
    }

    const promise = (async () => {
      try {
        const { Lucid: LucidModule, Blockfrost } = await import("lucid-cardano")
        const lucidInstance = await LucidModule.new(
          new Blockfrost(BLOCKFROST_API_URL, BLOCKFROST_PROJECT_ID),
          CARDANO_NETWORK
        )
        setLucid(lucidInstance)
        setInitializationError(null)
        return lucidInstance
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.error("Failed to initialise Lucid", error)
        setInitializationError(message)
        throw error instanceof Error ? error : new Error(message)
      } finally {
        setIsReady(true)
        initializationPromise.current = null
      }
    })()

    initializationPromise.current = promise

    return promise
  }, [lucid])

  useEffect(() => {
    initializeLucid().catch(() => null)
  }, [initializeLucid])

  const connect = useCallback(
    async (walletName: string) => {
      try {
        const lucidInstance = lucid ?? (await initializeLucid())

        if (!lucidInstance) {
          throw new Error(initializationError ?? "Lucid instance not ready")
        }

        const cardano = (window as any)?.cardano
        if (!cardano || !cardano[walletName]) {
          throw new Error(`Wallet ${walletName} is not installed or not exposed on window.cardano`)
        }

        const walletApi = await cardano[walletName].enable()
        await lucidInstance.selectWallet(walletApi)

        const [address, rewardAddress] = await Promise.all([
          lucidInstance.wallet.address(),
          lucidInstance.wallet.rewardAddress().catch(() => null),
        ])

        setLucid(lucidInstance)
        setAccount({ address, rewardAddress })
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error))
      }
    },
    [initializeLucid, initializationError, lucid]
  )

  const disconnect = useCallback(() => {
    setAccount(null)
  }, [])

  const value = useMemo(
    () => ({ lucid, account, connect, disconnect, isReady, network: CARDANO_NETWORK, initializationError }),
    [lucid, account, connect, disconnect, initializationError, isReady]
  )

  return <LucidContext.Provider value={value}>{children}</LucidContext.Provider>
}

export const useLucid = () => useContext(LucidContext)
