import { Modal } from './Modal'
import { useEffect } from 'react'

export default function DevErrorModal({ open, onClose, error, stack }: { open: boolean; onClose: () => void; error?: string; stack?: string }) {
  useEffect(() => {
    if (!open) return
    // lock scroll while open
    const orig = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = orig }
  }, [open])

  return (
    <Modal isOpen={open} onClose={onClose} title="Dev API Error">
      <div className="space-y-3 text-sm text-as-muted">
        <div className="font-semibold text-as-heading">{error ?? 'Unknown error'}</div>
        {stack ? (
          <pre className="max-h-60 overflow-auto rounded-md bg-black/80 p-3 text-xs text-white">{stack}</pre>
        ) : (
          <div className="text-xs text-as-muted">No stack available.</div>
        )}
      </div>
    </Modal>
  )
}
