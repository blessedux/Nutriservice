import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import SoundWidget from "@/components/sound-widget";
import { SiteExperience } from "@/components/site-experience";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nutriservice — Nutrición animal de alta precisión",
    template: "%s | Nutriservice",
  },
  description:
    "Sistema de nutrición animal que integra diagnóstico, formulación, implementación y optimización continua para mejorar productividad y reducir riesgo en producción animal.",
  metadataBase: new URL("https://nutriservice.cl"),
  icons: {
    icon: [
      { url: PUBLIC_ASSETS.brand.favicon, sizes: "any" },
      {
        url: PUBLIC_ASSETS.brand.icon512,
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: PUBLIC_ASSETS.brand.icon512,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <SoundWidget />
        <SiteExperience className="flex-1">
          <Nav />
          <main className="flex-1 pt-24">{children}</main>
          <Footer />
        </SiteExperience>
      </body>
    </html>
  );
}
