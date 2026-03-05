import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent webpack from trying to bundle ESM-only packages on the server side.
  // These packages are only used in "use client" components so this is safe.
  serverExternalPackages: [
    "viem",
    "wagmi",
    "@wagmi/core",
    "@reown/appkit",
    "@reown/appkit-adapter-wagmi",
    "ethers",
  ],

  webpack: (config) => {
    // Add node built-in fallbacks for browser bundles
    // (required by some sub-packages of viem/ethers)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
