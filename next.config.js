/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  trailingSlash: true,
  experimental: {
    appDir: true,
  },
  // Disable static generation for pages that need client-side rendering
  generateStaticParams: async () => {
    return []
  },
};

module.exports = nextConfig;
