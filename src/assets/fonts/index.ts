import localFont from "next/font/local";

export const geistSans = localFont({
  src: "./GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const geistMono = localFont({
  src: "./GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const syneSans = localFont({
  src: "./Syne-VariableFont_wght.ttf",
  variable: "--font-syne",
  weight: "100 900",
});

export const urbanistFont = localFont({
  src: "./Urbanist-VariableFont_wght.ttf",
  variable: "--font-urbanist",
  weight: "100 500 900",
});
