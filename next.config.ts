import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp"],
  experimental: {
    proxyClientMaxBodySize: "25mb",
  },
};

export default nextConfig;
