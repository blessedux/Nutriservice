import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import SoundWidget from "@/components/sound-widget";
import { SitePreloader } from "@/components/site-preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nutriservice — Nutrición animal de alta precisión",
    template: "%s | Nutriservice",
  },
  description:
    "Sistema de nutrición animal que integra diagnóstico, formulación, implementación y optimización continua para mejorar productividad y reducir riesgo en producción animal.",
  metadataBase: new URL("https://nutriservice.cl"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <SitePreloader />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <SoundWidget />
      </body>
    </html>
  );
}
