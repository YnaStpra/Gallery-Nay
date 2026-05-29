import type { Metadata } from "next";
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
