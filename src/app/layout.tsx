import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";

import "./globals.css";
import { headers } from 'next/headers'
import AppProvider from "../providers/app-provider";
import { geistMono, geistSans, syneSans, urbanistFont } from "@/assets/fonts";

const inter = Inter({
  subsets: ["latin"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque",
});

export const metadata: Metadata = {
  title: "Fundable",
  description: "A decentralized funding application built on Starknet",
  icons: {
    icon: "/favicon_io/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie')
  return (
    <html lang="en">
      <body
        className={`${bricolageGrotesque.variable} ${geistSans.variable} ${geistMono.variable} ${inter.className} ${syneSans.variable} ${urbanistFont.variable} antialiased bg-black overflow-hidden`}
      >
        <AppProvider cookies={cookies}>{children}</AppProvider>
      </body>
    </html>
  );
}
