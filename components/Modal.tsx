import { createPortal } from "react-dom"
import { ReactNode, useEffect, useState } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

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

  useEffect(() => {
    if (!isOpen) return

    const node = document.createElement("div")
    document.body.appendChild(node)
    setContainer(node)

    return () => {
      setContainer(null)
      document.body.removeChild(node)
    }
  }, [isOpen])

  if (!isOpen || !container) return null

  return createPortal(
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-[2001] w-full max-w-md rounded-[26px] border border-as-borderStrong/30 bg-as-surface/90 p-8 shadow-pixel">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-as-heading">
            {title ?? "Select Wallet"}
          </h2>
          <button
            onClick={onClose}
            className="pixel-btn px-3 py-1 text-[0.6rem]"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>,
    container
  )
}
