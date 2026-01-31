import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  turbopack:{

  },
  // Webpack configuration for PDF.js worker support
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side: exclude canvas for browser compatibility
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };  
    }
    return config;
  },
};

export default nextConfig;
