import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Used only at build time to rasterize PDF thumbnails; keep out of the bundle.
  serverExternalPackages: ["pdf-to-img", "pdfjs-dist", "@napi-rs/canvas", "sharp"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
    ],
  },
};

export default nextConfig;
