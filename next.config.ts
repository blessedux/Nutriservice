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
        destination: "/nosotros",
        permanent: true,
      },
      {
        source: "/impacto",
        destination: "/nosotros",
        permanent: true,
      },
      {
        source: "/soluciones/formulacion",
        destination: "/soluciones/maquila",
        permanent: true,
      },
      {
        source: "/productos",
        destination: "/productos?categoria=salud-animal",
        has: [
          {
            type: "query",
            key: "categoria",
            value: "salud-intestinal",
          },
        ],
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
