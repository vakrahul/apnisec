import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enables standard Webpack behavior features
  reactStrictMode: true,
  
  // This ensures we aren't accidentally opting into experimental turbo features
  experimental: {
    // turbo: {} // Keep this commented out or empty to avoid triggering Turbo
  }
};

export default nextConfig;