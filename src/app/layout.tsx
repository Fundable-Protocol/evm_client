import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';

import "./globals.css";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolageGrotesque.variable} ${geistSans.variable} ${geistMono.variable} ${inter.className} ${syneSans.variable} ${urbanistFont.variable} antialiased bg-black overflow-hidden`}
      >
        <AppProvider>{children}</AppProvider>
        <Analytics />
      </body>
    </html>
  );
}
