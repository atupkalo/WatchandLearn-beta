import type { Metadata } from "next";
import { Lato, Titillium_Web } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import HeaderMain from '@/components/common/header-main';

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Watch and Learn POC",
  description: "Watch and Learn Proof of Concept",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lato.variable} ${titillium.variable} h-full antialiased`}
    ><NextIntlClientProvider>
        <body className="min-h-full flex flex-col">
          <HeaderMain />
          {children}
        </body>
    </NextIntlClientProvider>

    </html>
  );
}
