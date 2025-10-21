import React from 'react'

const logos = [
  'https://via.placeholder.com/160x48?text=Matoa',
  'https://via.placeholder.com/160x48?text=Brodo',
  'https://via.placeholder.com/160x48?text=Gameloft',
  'https://via.placeholder.com/160x48?text=Cardano',
  'https://via.placeholder.com/160x48?text=ArtJog',
  'https://via.placeholder.com/160x48?text=ArtBali',
  'https://via.placeholder.com/160x48?text=IndoArtNow',
]

export default function PartnersCarousel() {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-6 items-center w-max py-4">
        {logos.map((l, i) => (
          <div key={i} className="h-12 w-40 flex items-center justify-center bg-white/5 rounded-lg border border-as-border/30">
            <img src={l} alt={`partner-${i}`} className="max-h-10 object-contain" />
          </div>
        ))}
      </div>
    </div>
  )
}
