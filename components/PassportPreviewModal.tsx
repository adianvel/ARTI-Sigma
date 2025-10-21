import React from 'react'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  passportJson: object | null
}

export default function PassportPreviewModal({ open, onClose, onConfirm, passportJson }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 fade-in">
      <div className="w-full max-w-2xl rounded-lg bg-as-surface p-6 slide-up">
        <h3 className="text-lg font-semibold">Preview ArtworksIDPassport</h3>
        <p className="text-sm text-as-muted mt-2">Please review the passport JSON before confirming mint.</p>

        {/* Friendly fractional summary when present */}
        {passportJson && (passportJson as any).platform_info?.fractional && (
          <div className="mt-4 rounded-2xl border border-as-border p-3 bg-as-background text-sm">
            <div className="font-semibold">Fractional mint summary</div>
            <div>Total units: {(passportJson as any).platform_info.fractional.total_units}</div>
            <div>Sale type: {(passportJson as any).platform_info.fractional.sale_type}</div>
            <div>Price per unit (IDR): {(passportJson as any).platform_info.fractional.price_primary_idr ?? '—'}</div>
            <div>Partner share: {(passportJson as any).platform_info.fractional.partner_share_percent ?? '—'}%</div>
          </div>
        )}

        <div className="mt-4 max-h-72 overflow-auto rounded border border-as-border p-3 bg-as-background">
          <pre className="text-xs">{passportJson ? JSON.stringify(passportJson, null, 2) : 'No data'}</pre>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="pixel-btn px-4 py-2">Cancel</button>
          <button onClick={onConfirm} className="pixel-btn pixel-btn--primary px-4 py-2">Confirm & Mint</button>
        </div>
      </div>
    </div>
  )
}
