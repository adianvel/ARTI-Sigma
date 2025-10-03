const NotFoundPage = () => {
  return (
    <div className="flex h-[calc(100vh-96px)] items-center justify-center text-pl-heading">
      <div className="pixel-card pixel-dither px-8 py-12 text-center">
        <h1 className="font-display text-5xl tracking-[0.3em]">404</h1>
        <p className="mt-4 text-sm uppercase tracking-[0.35em] text-pl-muted">Not found</p>
      </div>
    </div>
  )
}

export default NotFoundPage
