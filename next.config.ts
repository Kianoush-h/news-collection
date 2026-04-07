import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "crisiswatch.azurewebsites.net" }],
        destination: "https://crisiswatch.ca/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
