/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'ipfs.io',
      'cloudflare-ipfs.com',
      'dweb.link',
      'purple-persistent-booby-135.mypinata.cloud',
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'ipfs.io', pathname: '/ipfs/**' },
      { protocol: 'https', hostname: 'cloudflare-ipfs.com', pathname: '/ipfs/**' },
      { protocol: 'https', hostname: 'dweb.link', pathname: '/ipfs/**' },
      { protocol: 'https', hostname: 'purple-persistent-booby-135.mypinata.cloud', pathname: '/ipfs/**' },
    ],
  },
  webpack: (config) => {
    config.experiments = {
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true,
    }
    return config
  },
}

module.exports = nextConfig
