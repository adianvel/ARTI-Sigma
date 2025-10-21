import { createContext, useContext, useState } from 'react'
import DevErrorModal from '../components/DevErrorModal'

type DevError = { error?: string; stack?: string }

const DevErrorCtx = createContext<{ show: (d: DevError) => void } | null>(null)

export const DevErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false)
  const [payload, setPayload] = useState<DevError | undefined>(undefined)

  const show = (d: DevError) => {
    if (process.env.NODE_ENV === 'production') return
    setPayload(d)
    setOpen(true)
  }

  return (
    <DevErrorCtx.Provider value={{ show }}>
      {children}
      <DevErrorModal open={open} onClose={() => setOpen(false)} error={payload?.error} stack={payload?.stack} />
    </DevErrorCtx.Provider>
  )
}

export const useDevError = () => {
  const ctx = useContext(DevErrorCtx)
  if (!ctx) return { show: (_: DevError) => {} }
  return ctx
}
