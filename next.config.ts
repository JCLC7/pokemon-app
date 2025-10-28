import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
  transpilePackages: ['@ducanh2912/next-pwa'],
};

export default withPWA({
  dest: "public",
  customWorkerSrc: "worker",
})(nextConfig);