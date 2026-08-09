import type { NextConfig } from "next";

const basePath = process.env.GITHUB_ACTIONS === "true" ? "/Dalma-Website" : "";

const nextConfig: NextConfig = {
  // Static export: `npm run build` produces a plain HTML/CSS/JS site in `out/`
  // that runs on any web server (and on Vercel). Hosting decision still open.
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
