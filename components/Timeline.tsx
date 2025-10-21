import React from 'react'

const steps = [
  { id: 1, title: 'Connect Your Wallet', detail: 'Nami / Eternl / GameChanger' },
  { id: 2, title: 'Upload & Mint', detail: 'Artwork + Metadata stored in IPFS' },
  { id: 3, title: 'Set Royalties & Ownership', detail: 'Creator, Curator, Investor shares' },
  { id: 4, title: 'Fund & Trade', detail: 'Collectors fund and trade fractional NFTs globally' },
]

export default function Timeline() {
  return (
    <div className="space-y-4">
      {steps.map((s) => (
        <div key={s.id} className="flex items-start gap-4">
          <div className="font-mono text-cyan-400">{s.id}.</div>
          <div>
            <div className="font-semibold">{s.title}</div>
            <div className="text-sm text-as-muted">{s.detail}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
