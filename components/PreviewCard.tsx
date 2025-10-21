import React, { useState } from 'react'

type Props = {
  image: string
}

export default function PreviewCard({ image }: Props) {
  const [royalty, setRoyalty] = useState(5)

  return (
    <div>
      <div className="text-xs text-as-muted uppercase">Real-time preview</div>
      <div className="mt-2 rounded-lg border border-as-border p-3 bg-as-surface/60">
        <div className="mb-3">
          <img src={image} alt="preview" className="w-full rounded" />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-semibold">Minted On Cardano</div>
            <div className="text-xs text-as-muted">Royalty: {royalty}%</div>
          </div>
          <div className="text-xs text-as-muted">Preview</div>
        </div>
        <div className="mt-3">
          <input
            type="range"
            min="0"
            max="20"
            value={royalty}
            onChange={(e) => setRoyalty(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
