import type { DetailedHTMLProps, HTMLAttributes } from "react"

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        poster?: string
        autoplay?: boolean
        ar?: boolean
        "camera-controls"?: boolean
        "disable-zoom"?: boolean
        "interaction-prompt"?: string
      }
    }
  }
}

export {}
