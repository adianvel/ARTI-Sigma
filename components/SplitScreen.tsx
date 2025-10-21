import React from 'react'

type Props = {
  leftImage: string
  rightImage: string
}

export default function SplitScreen({ leftImage, rightImage }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="relative overflow-hidden rounded-lg border border-as-border/40 bg-gray-100/10">
        <img src={leftImage} alt="Old World Art Gallery" className="w-full h-48 object-cover filter grayscale" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/40 px-4 py-2 rounded text-sm text-white">Old World Art Gallery</div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-as-border/40 bg-gradient-to-br from-cyan-400 to-blue-600">
        <img src={rightImage} alt="Decentralized NFT Mint" className="w-full h-48 object-cover mix-blend-overlay opacity-90" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded text-sm text-white">Decentralized NFT Mint</div>
        </div>
      </div>
    </div>
  )
}
