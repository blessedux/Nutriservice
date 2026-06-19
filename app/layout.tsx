import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import { CtaFooterParallaxProvider } from "@/components/cta-footer-parallax-provider";
import SiteFooter from "@/components/site-footer";
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
      { url: "/favicon.ico", sizes: "any" },
      {
        url: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://nutriservice.cl",
    siteName: "Nutriservice",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Nutriservice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/icon.png"],
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
        <CtaFooterParallaxProvider>
          <SiteExperience className="flex-1">
            <Nav />
            <main className="site-main-offset flex-1">{children}</main>
            <SiteFooter />
          </SiteExperience>
        </CtaFooterParallaxProvider>
      </body>
    </html>
  );
}
