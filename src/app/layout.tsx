import type { Metadata } from "next";
import { IBM_Plex_Sans_JP } from "next/font/google";
import "./globals.css";

const ibmPlexSansJp = IBM_Plex_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://color.nenrin.me"),
  title: {
    default: "color.nenrin.me",
    template: "%s | color.nenrin.me",
  },
  description: "日付と季節から、その日の色を表示します。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "color.nenrin.me",
    description: "日付と季節から、その日の色を表示します。",
    url: "/",
    siteName: "color.nenrin.me",
    type: "website",
    locale: "ja_JP",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "color.nenrin.me",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "color.nenrin.me",
    description: "日付と季節から、その日の色を表示します。",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${ibmPlexSansJp.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
