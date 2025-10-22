import { useEffect, useState } from 'react'

export const usePrefersDark = () => {
  const [prefersDark, setPrefersDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setPrefersDark(mq.matches)
    mq.addEventListener ? mq.addEventListener('change', handler) : mq.addListener(handler)
    return () => { mq.removeEventListener ? mq.removeEventListener('change', handler) : mq.removeListener(handler) }
  }, [])

  return prefersDark
}

export default usePrefersDark
