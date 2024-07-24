import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { FiLink } from "react-icons/fi";
import SessionProviderWrapper from "@/providers/SessionProviderWrapper";

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
      <body className={`${instrumentSans.className} ${instrumentSans.className}`}>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
      <Toaster position="bottom-center" toastOptions={{
        unstyled: true,
        classNames: {
          error: 'bg-primary sm:min-w-[397px] flex items-center gap-1 text-red-400 text-sm font-semibold rounded-lg px-6 py-4 sm:-ml-5',
          success: 'bg-primary sm:min-w-[397px] flex items-center justify-center gap-2 text-[#FAFAFA] font-semibold rounded-lg px-6 py-4 sm:-ml-5',
          warning: 'text-yellow-400',
          info: 'bg-blue-400',
        },
      }}
        icons={{
          success: <FiLink strokeWidth={2.2} color="#737373" size={20} />,
        }}
      />
    </html>
  );
}
