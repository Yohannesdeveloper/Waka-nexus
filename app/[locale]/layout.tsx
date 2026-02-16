import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WAKA Global Art & Music Nexus | International Cultural Platform from the UAE",
  description:
    "WAKA Global Art & Music Nexus is an international art exhibition and competition platform connecting artists, cities, and institutions through curated global events.",
  keywords:
    "Global art exhibition, UAE art initiative, International art competition, Cultural platform UAE, Creative economy platform",
};

import CustomCursor from "../components/CustomCursor";

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${outfit.variable} font-sans antialiased grain-overlay`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CustomCursor />
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
