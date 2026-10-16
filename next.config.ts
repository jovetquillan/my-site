import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "quillan.is-best.net" },
    ],
  },
};

export default nextConfig;