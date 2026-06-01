import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "My Travel Gallery",
  authors: [{ name: "Yan Saputra" }],
  creator: "Yan Saputra",
  description:
    "A public travel photography archive by Yan Saputra with protected viewing and complete image metadata.",
  keywords: [
    "travel photography",
    "photo gallery",
    "Yan Saputra",
    "Indonesia photography",
    "photo metadata",
  ],
  openGraph: {
    description:
      "Travel frames by Yan Saputra with location, camera, lens, exposure, and rights metadata.",
    locale: "en_US",
    siteName: "My Travel Gallery",
    title: "My Travel Gallery",
    type: "website",
  },
  title: {
    default: "My Travel Gallery",
    template: "%s | My Travel Gallery",
  },
  twitter: {
    card: "summary_large_image",
    description:
      "Travel frames by Yan Saputra with location, camera, lens, exposure, and rights metadata.",
    title: "My Travel Gallery",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Link
          href="/admin"
          className="fixed left-4 bottom-4 z-50 inline-flex items-center justify-center rounded-full bg-cyan-500/95 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-cyan-500/20 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        >
          Admin Upload
        </Link>
      </body>
    </html>
  );
}
