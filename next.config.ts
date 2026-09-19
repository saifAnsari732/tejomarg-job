import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  allowedDevOrigins: ["tejomargjobs.com", "www.tejomargjobs.com", "tejomargjob.com", "www.tejomargjob.com", "localhost:3045"],
  serverExternalPackages: ["firebase-admin", "mongoose", "jwks-rsa", "jose", "pdf-parse"],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
};

export default nextConfig;
