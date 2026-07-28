import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MainNavigation } from "./_components/MainNavigation";
import { KeyboardShortcutsLayer } from "./_components/KeyboardShortcutsLayer";

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
    "A minimalist photography portfolio by Yan Saputra focused on gallery viewing, collections, and stories.",
  keywords: [
    "travel photography",
    "photo journal",
    "Yan Saputra",
    "travel stories",
    "editorial photography",
  ],
  openGraph: {
    description:
      "Explore Yan Saputra's photography portfolio through galleries, collections, and stories.",
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
      "Photography portfolio by Yan Saputra.",
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
        <KeyboardShortcutsLayer>
          <MainNavigation />
          <main className="flex-1">{children}</main>
        </KeyboardShortcutsLayer>
      </body>
    </html>
  );
}
