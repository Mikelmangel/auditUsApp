import type { NextConfig } from "next";
import path from "path";

const isMobileExport = process.env.CAPACITOR_BUILD === "true";

const nextConfig: NextConfig = {
  ...(isMobileExport && {
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
  }),
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    ...(isMobileExport && { unoptimized: true }),
  },
};

export default nextConfig;
