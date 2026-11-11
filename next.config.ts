import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  async redirects() {
    return [
      { source: "/categories/fashion", destination: "/categories/fashion-clothing", permanent: true },
      { source: "/categories/anime", destination: "/categories/anime-collectibles", permanent: true },
      {
        source: "/categories/school-supplies",
        destination: "/categories/school-office-supplies",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
