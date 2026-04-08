import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://streakx.app"),
  title: {
    default: "StreakX — Fitness Discipline Engine",
    template: "%s | StreakX"
  },
  description: "High-performance fitness tracking for those who don't break. Built with Streaks, Side-Panel navigation, and Discipline.",
  icons: {
    icon: "/brand/logo.png",
    shortcut: "/brand/logo.png",
    apple: "/brand/logo.png",
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "StreakX" },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://streakx.app",
    siteName: "StreakX",
    title: "StreakX — Fitness Discipline Engine",
    description: "Build unbreakable habits. Master your workouts.",
    images: [{ url: "/brand/logo.png", width: 1200, height: 630, alt: "StreakX Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "StreakX — Fitness Discipline Engine",
    description: "Build unbreakable habits. Master your workouts.",
    images: ["/brand/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-[#050507] text-white selection:bg-accent-purple/30`} suppressHydrationWarning>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
