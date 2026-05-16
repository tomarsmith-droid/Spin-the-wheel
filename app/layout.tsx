import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { TopNav } from "@/components/TopNav";
import { MobileNav } from "@/components/MobileNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Decision Wheel Pro — spin to decide",
  description:
    "A beautifully animated decision wheel with classic, elimination, tournament, party, date night and weighted modes. Save wheels, track stats, party-night-ready.",
  applicationName: "Decision Wheel Pro",
  authors: [{ name: "Decision Wheel Pro" }],
  openGraph: {
    title: "Decision Wheel Pro",
    description: "Spin the wheel. Make the call. Have more fun deciding.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05080F" },
    { media: "(prefers-color-scheme: light)", color: "#FAFAFC" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <div className="app-backdrop" aria-hidden />
          <TopNav />
          <main className="pb-28 md:pb-12 pt-4 md:pt-8 px-4 md:px-8 max-w-7xl mx-auto">
            {children}
          </main>
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
