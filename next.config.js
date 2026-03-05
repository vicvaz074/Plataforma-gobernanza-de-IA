/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  output: 'export',
  reactStrictMode: true,
<<<<<<< HEAD
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["hebbkx1anhila5yf.public.blob.vercel-storage.com"],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
  webpack: (config) => {
    return config
  },
}

module.exports = nextConfig
=======

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
    ],
  },

  serverExternalPackages: [],

  turbopack: {}, // evita el error de webpack vs turbopack
}

module.exports = nextConfig
>>>>>>> be37263 (fix: modify EIA module and upgrade it)
