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
};

export default withPWA({
  register: true,
  swcMinify: false,
  workboxOptions: {
    skipWaiting: true,
    runtimeCaching: [
    {
      urlPattern: /\/pokemon\/\d+/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "pokemon-detail-pages",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
        },
      },
    },
    {
      urlPattern: /^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/?$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "pokemon-list",
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
        },
      },
    },
    {
      urlPattern: /^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "pokemon-details",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
        },
      },
    },
    {
      urlPattern: /^https:\/\/raw\.githubusercontent\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "pokemon-images",
        expiration: {
          maxEntries: 200, // Cache up to 200 images
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
      },
    },
  ],
  },
})(nextConfig);