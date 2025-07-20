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
  output: 'export',
  distDir: 'out',
};

module.exports = nextConfig;
