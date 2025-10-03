const PrivacyPolicy = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 text-pl-body">
      <header className="space-y-3 text-center">
        <h1 className="font-display text-4xl tracking-[0.25em] text-pl-heading">Privacy Policy</h1>
        <p className="text-sm text-pl-muted">How we handle the data you share while using PetLog.</p>
      </header>
      <div className="pixel-card p-6 text-sm leading-relaxed text-pl-body">
        <p>PetLog stores only the metadata required to mint your NFT passport. Self-attested details remain in your custody and are published to IPFS only with your consent.</p>
      </div>
    </div>
  )
}

export default PrivacyPolicy
