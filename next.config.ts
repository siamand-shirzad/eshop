import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // this folder is the project root even if a lockfile exists higher up
  turbopack: { root: process.cwd() },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
