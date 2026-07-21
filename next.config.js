const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    // Let an updated worker activate after existing tabs close. Taking control
    // mid-session can mix assets from two different deployments.
    skipWaiting: false,
    // This decorative source image is 8 MB and should be fetched on demand,
    // not downloaded into every installation's offline cache.
    exclude: [
      /\/_next\/static\/.*(?<!\.p)\.woff2/,
      /\.map$/,
      /^manifest.*\.js$/,
      /stream\.[a-f0-9]+\.svg$/,
    ],
    runtimeCaching: [
      {
        // Financial and account data must never fall back to a stale response.
        urlPattern: ({ url, sameOrigin }) =>
          sameOrigin && url.pathname.startsWith("/api/"),
        handler: "NetworkOnly",
        method: "GET",
        options: {
          cacheName: "apis",
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

module.exports = withPWA(nextConfig);
