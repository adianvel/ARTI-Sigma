import Link from 'next/link'
import { NextPageContext } from 'next'

type Props = {
  statusCode?: number
}

export default function ErrorPage({ statusCode }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-4 text-as-muted">{statusCode ? `Error ${statusCode}` : 'An unexpected error occurred.'}</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/" className="pixel-btn px-6 py-3">
          Home
        </Link>
        <Link href="/marketplace" className="pixel-btn px-6 py-3">
          Marketplace
        </Link>
      </div>
    </div>
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? (err ? (err as any).statusCode : 404)
  return { statusCode }
}
