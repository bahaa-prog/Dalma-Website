import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone: `npm run build` traces the minimal server + node_modules needed
  // into .next/standalone/server.js, deployed to the VPS behind PM2 + Nginx.
  output: "standalone",
};

export default nextConfig;
