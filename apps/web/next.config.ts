import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@fitness/shared", "@fitness/ui"],
  devIndicators: false,
};

export default nextConfig;
