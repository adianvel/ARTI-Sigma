import { ReactNode, useEffect } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(62,42,30,0.55)] backdrop-blur-sm">
      <div className="pixel-card max-w-md w-full bg-pl-surface p-6 shadow-pixel">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="font-display text-base text-pl-heading">
            {title ?? "Select Wallet"}
          </h2>
          <button
            onClick={onClose}
            className="pixel-btn px-2 py-1 text-base"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

