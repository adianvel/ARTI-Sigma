import { Terminal } from "lucide-react"
import { twMerge } from "tailwind-merge"

type Props = {
  className?: string
  size?: number
}

export const CommandLineIcon = ({ className, size = 24 }: Props) => (
  <Terminal size={size} className={twMerge("text-current", className)} />
)
