import React, { useEffect, useState } from 'react'

const steps = ['Canvas', 'Token', 'Investor', 'Impact']

export default function ScrollSequence() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % steps.length), 1800)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="mt-4 flex items-center justify-center">
      <div className="inline-flex items-center gap-3 rounded-full bg-as-surface/60 px-4 py-2 text-sm font-semibold">
        <span className="text-as-muted/70">From</span>
        <div className="mx-2 text-cyan-400 font-mono animate-pulse">{steps[index]}</div>
        <span className="text-as-muted/70">→</span>
        <div className="mx-2 text-as-muted">{steps[(index + 1) % steps.length]}</div>
      </div>
    </div>
  )
}
