import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    mdxRs: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org'
      },
      {
        protocol: 'https',
        hostname: 'media.themoviedb.org'
      }
    ]
  }
}

export default nextConfig
