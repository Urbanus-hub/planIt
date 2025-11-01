import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporarily disable Turbopack experimental features
  // experimental:{
  //   turbopackFileSystemCacheForDev:true
  // }
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
