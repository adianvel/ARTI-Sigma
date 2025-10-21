import type { AppProps } from "next/app"
import { DefaultLayout } from "layouts/DefaultLayout"
import { LucidProvider } from "../contexts/LucidContext"
import { DevErrorProvider } from "../contexts/DevErrorContext"
import "../styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LucidProvider>
      <DevErrorProvider>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </DevErrorProvider>
    </LucidProvider>
  )
}
