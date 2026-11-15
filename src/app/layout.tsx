import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CHRONOS — Fine Watches & Timepieces",
  description:
    "CHRONOS is a boutique house of fine timepieces. Discover curated mechanical watches from the world's most prestigious independent maisons — dress, dive, pilot and skeleton.",
  keywords: [
    "luxury watches",
    "watches",
    "chronograph",
    "dive watch",
    "dress watch",
    "CHRONOS",
  ],
  openGraph: {
    title: "CHRONOS — Fine Watches & Timepieces",
    description:
      "Curated mechanical watches from prestigious independent maisons.",
    siteName: "CHRONOS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
