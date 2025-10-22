import type { AppProps } from "next/app"
import { DefaultLayout } from "layouts/DefaultLayout"
import { LucidProvider } from "../contexts/LucidContext"
import { DevErrorProvider } from "../contexts/DevErrorContext"
import "../styles/globals.css"

import { Inter, Unbounded } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['300','400','600','700'] })
const unbounded = Unbounded({ subsets: ['latin'], variable: '--font-unbounded', weight: ['400','700','800'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${unbounded.variable}`}>
      <LucidProvider>
        <DevErrorProvider>
          <DefaultLayout>
            <Component {...pageProps} />
          </DefaultLayout>
        </DevErrorProvider>
      </LucidProvider>
    </div>
  )
}
