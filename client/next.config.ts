import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**", pathname: "**" }],
  },
};

export default nextConfig;
