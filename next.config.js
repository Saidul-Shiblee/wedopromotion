/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Disable static generation for problematic routes
  experimental: {
    // Disable static generation for problematic routes
    staticPageGenerationTimeout: 120,
  },
  // Ensure we're using the correct output mode
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["soundcamps.com", "v0.blob.vercel-storage.com", "hebbkx1anhila5yf.public.blob.vercel-storage.com"],
    unoptimized: true,
  },
}

module.exports = nextConfig
