import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MainNavigation } from "./_components/MainNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "Yan Saputra Photography",
  authors: [{ name: "Yan Saputra" }],
  creator: "Yan Saputra",
  description:
    "A travel photography journal by Yan Saputra, blending premium imagery with stories, insights, and editorial journeys.",
  keywords: [
    "travel photography",
    "photo journal",
    "Yan Saputra",
    "travel stories",
    "editorial photography",
  ],
  openGraph: {
    description:
      "Explore Yan Saputra's travel photography journal with stories, timeline, gear insights, and cinematic visuals.",
    locale: "en_US",
    siteName: "Yan Saputra Photography",
    title: "Yan Saputra Photography",
    type: "website",
  },
  title: {
    default: "Yan Saputra Photography",
    template: "%s | Yan Saputra Photography",
  },
  twitter: {
    card: "summary_large_image",
    description:
      "Travel photography stories, timelines, and insights from Yan Saputra.",
    title: "Yan Saputra Photography",
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
      <body className="min-h-full bg-[#050505] text-white">
        <MainNavigation />
        <main className="flex-1">{children}</main>
        <a
          href="/admin"
          className="fixed left-4 bottom-4 z-50 inline-flex items-center justify-center rounded-full bg-cyan-500/95 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-cyan-500/20 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        >
          Admin Upload
        </a>
      </body>
    </html>
  );
}
