import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/tecnologia",
        destination: "/nosotros",
        permanent: true,
      },
      {
        source: "/impact",
        destination: "/impacto",
        permanent: true,
      },
      {
        source: "/soluciones/formulacion",
        destination: "/soluciones/maquila",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
