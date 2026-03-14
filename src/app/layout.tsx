import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";

import "./globals.css";
import { headers } from 'next/headers'
import AppProvider from "../providers/app-provider";
import { geistMono, geistSans, syneSans, urbanistFont } from "@/assets/fonts";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque",
});

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL;
  return {
    title: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Fundable",
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A decentralized funding application.",
    icons: {
      icon: "/favicon_io/favicon.ico",
    },
    other: {
      "fc:miniapp": JSON.stringify({
        version: "next",
        imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
        button: {
          title: `Launch ${process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Fundable"}`,
          action: {
            type: "launch_frame",
            name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Fundable",
            url: URL,
            splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE,
            splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
          },
        },
      }),
    },
  };
}

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
        <Analytics />
      </body>
    </html>
  );
}
