"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const tm = useTranslations("metadata");
  const tc = useTranslations("common");

  const footerLinks = [
    { href: "/", label: t("home") },
    { href: "/exhibitions", label: t("exhibitions") },
    { href: "/competition", label: t("competition") },
    { href: "/jury-governance", label: t("juryGovernance") },
    { href: "/partners", label: t("partners") },
    { href: "/media", label: t("media") },
    { href: "/contact", label: t("contact") },
    { href: "/apply", label: t("submitArtwork") },
  ];

  return (
    <footer className="relative border-t border-white/5 py-16 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#5A2EFF]/05 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          {/* Brand & Description */}
          <div className="max-w-xl">
            <motion.span
              className="font-display text-xl font-medium text-white block mb-4"
              whileHover={{ scale: 1.02 }}
            >
              {tc("logoWaka")} {tc("logoNexus")}
            </motion.span>
            <p className="text-white/50 text-sm leading-relaxed">
              {tf("description")}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm md:justify-end">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-underline text-white/50 hover:text-[#00F0FF] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} {tc("logoWaka")} {tc("logoNexus")}. {tf("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
