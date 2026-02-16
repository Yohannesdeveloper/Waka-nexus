import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, locales, type Locale } from "./config";

// Import messages statically for better production support
import enMessages from '../messages/en.json';
import amMessages from '../messages/am.json';

const messagesMap = {
  en: enMessages,
  am: amMessages
};

export default getRequestConfig(async ({ requestLocale }) => {
  // Use the locale from the [locale] segment
  let locale = await requestLocale;

  // Validate and fallback
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (messagesMap as any)[locale] || messagesMap.en
  };
});
