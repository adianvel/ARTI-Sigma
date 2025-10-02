import type { AppProps } from "next/app"
import { DefaultLayout } from "layouts/DefaultLayout"
import { LucidProvider } from "../contexts/LucidContext"
import "../styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LucidProvider>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </LucidProvider>
  )
}
