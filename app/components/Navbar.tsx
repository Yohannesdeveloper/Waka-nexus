import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth-actions";
import { getLocale } from "@/i18n/actions";
import NavbarWrapper from "./NavbarWrapper";

export default async function Navbar() {
  let user = null;
  let locale = "en" as any;
  let t: any = null;

  try {
    const [userData, localeData, translations] = await Promise.all([
      getCurrentUser().catch(() => null),
      getLocale().catch(() => "en" as any),
      getTranslations("nav").catch(() => null),
    ]);
    user = userData;
    locale = localeData;
    t = translations;
  } catch (e) {
    console.error("Navbar data fetch failure:", e);
  }

  // Fallback t function if it failed to load
  const safeT = (key: string) => {
    if (t) {
      try {
        return t(key);
      } catch (e) {
        // Fallback for specific missing keys
      }
    }
    const fallbacks: Record<string, string> = {
      home: "Home",
      about: "About",
      exhibitions: "Exhibitions",
      investors: "Investors",
      juryGovernance: "Jury",
      partners: "Partners",
      media: "Media",
      artists: "Artists",
      contact: "Contact",
    };
    return fallbacks[key] || key;
  };

  const navLinks = [
    { href: "/", label: safeT("home") },
    { href: "/about", label: safeT("about") },
    { href: "/exhibitions", label: safeT("exhibitions") },
    { href: "/investors", label: safeT("investors") },
    { href: "/jury-governance", label: safeT("juryGovernance") },
    { href: "/partners", label: safeT("partners") },
    { href: "/media", label: safeT("media") },
    { href: "/artists", label: safeT("artists") },
    { href: "/contact", label: safeT("contact") },
  ];

  return <NavbarWrapper navLinks={navLinks} user={user} locale={locale} />;
}
