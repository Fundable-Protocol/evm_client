import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // These heavy ESM-only packages must not be bundled by webpack on the server.
  // They are only used in client components ("use client"), so this is safe.
  serverExternalPackages: [
    "viem",
    "wagmi",
    "@wagmi/core",
    "@reown/appkit",
    "@reown/appkit-adapter-wagmi",
    "ethers",
  ],

  webpack: (config, { isServer }) => {
    // Silence the "Webpack is configured while Turbopack is not" warning by
    // providing a minimal webpack customisation that is compatible with both.

    // viem, wagmi and friends ship as pure ESM and declare `require()` as
    // forbidden via `exports` conditions.  Webpack 5 resolves the right
    // directory by default, but some sub-packages are not marked as ESM in
    // their main package.json, causing webpack to try the CJS version which
    // does not exist.  Forcing the `browser` + `module` export condition
    // fixes the resolution for client bundles.
    if (!isServer) {
      config.resolve.conditionNames = [
        "browser",
        "module",
        "import",
        "default",
      ];
    }

    // Fallbacks for node built-ins used by some deps in browser bundles
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    return config;
  },
};

export default nextConfig;
