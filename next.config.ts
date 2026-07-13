import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `npm run build` produces a plain HTML/CSS/JS site in `out/`
  // that runs on any web server (and on Vercel). Hosting decision still open.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
