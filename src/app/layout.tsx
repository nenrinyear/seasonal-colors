import type { Metadata } from "next";
import { IBM_Plex_Sans_JP } from "next/font/google";
import "./globals.css";

const ibmPlexSansJp = IBM_Plex_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
})

export const metadata: Metadata = {
  title: "A Color a Day",
  description: "四季に応じて変化する色を毎日お届けします。",
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
