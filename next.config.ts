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

  webpack: (config, { isServer }) => {
    // Add node built-in fallbacks for browser bundles only.
    // (required by some sub-packages of viem/ethers in the client bundle)
    // Server bundles must NOT have these stubbed out — src/lib/utils/index.ts
    // uses Node's crypto module (randomUUID, randomBytes) server-side.
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
