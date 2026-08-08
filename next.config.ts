import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["tejomargjob.com", "www.tejomargjob.com", "localhost:3045"],
  serverExternalPackages: ["firebase-admin", "mongoose", "jwks-rsa", "jose"],
};

export default nextConfig;
