import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";

export const metadata: Metadata = {
  metadataBase: new URL("https://ahumane.app"),
  title: {
    default: "AHumane — Free AI Humanizer, Detector & Writing Studio",
    template: "%s · AHumane",
  },
  description:
    "AHumane is a free AI humanizer and writing studio. Rewrite AI text into natural prose with the Pro Humanizer, check it with a transparent AI detector, and scan for plagiarism — no account, no word caps, no paywall.",
  keywords: [
    "AI humanizer",
    "free AI humanizer",
    "humanize AI text",
    "AI detector",
    "plagiarism checker",
    "natural AI writing",
    "AHumane",
  ],
  applicationName: "AHumane",
  authors: [{ name: "AHumane" }],
  creator: "AHumane",
  openGraph: {
    type: "website",
    siteName: "AHumane",
    title: "AHumane — Free AI Humanizer, Detector & Writing Studio",
    description:
      "Turn AI text into writing that sounds like you. Pro humanizer, AI detector, plagiarism checker and writing studio. Free forever.",
    url: "https://ahumane.app",
    images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "AHumane — free AI humanizer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AHumane — Free AI Humanizer",
    description:
      "Turn AI text into writing that sounds like you. Free Pro humanizer, AI detector and plagiarism checker.",
    images: ["/brand/og.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/brand/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg"
        >
          Skip to content
        </a>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
