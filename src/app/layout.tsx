import type { Metadata } from "next";
import { Lato, Titillium_Web } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";
import Script from "next/script";
import { AuthPopoverProvider } from "@/components/providers/auth-popover-provider";
import { UserPreferencesProvider } from "@/components/providers/user-preferences-provider";
import {
  defaultInterfaceLanguage,
  defaultStudyLanguage,
  isInterfaceLanguage,
  isStudyLanguage,
} from "@/lib/user-preferences";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const initialInterfaceLanguage = isInterfaceLanguage(locale)
    ? locale
    : defaultInterfaceLanguage;
  const studyLanguageCookie = cookieStore.get("studyLanguage")?.value;
  const initialStudyLanguage = isStudyLanguage(studyLanguageCookie)
    ? studyLanguageCookie
    : defaultStudyLanguage;

  return (
    <html
      lang={locale}
      className={`${lato.variable} ${titillium.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <AuthPopoverProvider>
            <UserPreferencesProvider
              initialInterfaceLanguage={initialInterfaceLanguage}
              initialStudyLanguage={initialStudyLanguage}
            >
              {children}
            </UserPreferencesProvider>
          </AuthPopoverProvider>
        </NextIntlClientProvider>
        {adsenseClientId ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
