import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({ weight: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Dev Link",
  description: "We’re here to help you share your profiles with everyone!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </head>
      <body className={`${instrumentSans.className} ${instrumentSans.className}`}>{children}</body>
    </html>
  );
}
