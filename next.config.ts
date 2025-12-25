import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // We remove the 'experimental' block completely.
  // This forces Next.js to use the default Webpack bundler.
  reactStrictMode: true,
};

export default nextConfig;