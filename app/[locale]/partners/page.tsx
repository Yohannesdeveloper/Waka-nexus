"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface Partner {
  id: string;
  name: string;
  category: string;
  logoUrl: string | null;
  website?: string;
  order: number;
}

export default function Partners() {
  const t = useTranslations("partners");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPartners = () => {
      const saved = localStorage.getItem("waka_partners");
      if (saved) {
        setPartners(JSON.parse(saved));
      }
      setIsLoading(false);
    };

    // Load initially
    loadPartners();

    // Listen for storage changes (when CMS updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "waka_partners") {
        loadPartners();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check periodically for changes in same tab
    const interval = setInterval(loadPartners, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/60">{t("loading")}</p>
        </div>
      </main>
    );
  }

  const sponsorshipCategories = [
    t("categories.titleSponsor"),
    t("categories.bankingPartner"),
    t("categories.foundingPartner"),
    t("categories.culturalPartner"),
    t("categories.mediaPartner"),
  ];

  const partnerBenefits = [
    t("benefits.logoPlacement"),
    t("benefits.digitalVisibility"),
    t("benefits.pressRecognition"),
    t("benefits.eventBranding"),
    t("benefits.panelAcknowledgment"),
    t("benefits.venueAdvertising"),
    t("benefits.socialMedia"),
  ];

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4">{t("subtitle")}</p>
          <h1 className="font-display text-4xl md:text-6xl font-light text-white mb-6">
            {t("title")}
          </h1>
        </div>

        {/* Partner With WAKA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-display text-2xl md:text-3xl font-light text-white mb-6">
            {t("partnerWithWaka")}
          </h2>
          <p className="text-white/70 leading-relaxed max-w-3xl">
            {t("partnerWithWakaDescription")}
          </p>
        </motion.section>

        {/* Sponsorship Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="font-display text-2xl md:text-3xl font-light text-white mb-6">
            {t("sponsorshipCategories")}
          </h2>
          <ul className="space-y-3">
            {sponsorshipCategories.map((category, index) => (
              <li key={index} className="flex items-center gap-3 text-white/70">
                <span className="text-[#c9a962]">•</span>
                <span>{category}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Partner Benefits */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="font-display text-2xl md:text-3xl font-light text-white mb-6">
            {t("partnerBenefits")}
          </h2>
          <ul className="space-y-3">
            {partnerBenefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-3 text-white/70">
                <span className="text-[#c9a962]">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Closing Statement */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <p className="text-white/70 leading-relaxed max-w-3xl">
            {t("closingStatement")}
          </p>
        </motion.section>

        {/* Divider */}
        <div className="border-t border-white/10 my-12"></div>

        {/* Partner Logos Grid */}
        {partners.length === 0 ? (
          <div className="text-center py-12 mb-16">
            <p className="text-white/60">{t("noPartners")}</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16"
          >
            {partners.sort((a, b) => a.order - b.order).map((partner, index) => {
              const PartnerCard = (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group bg-white/5 border border-white/10 rounded-lg p-8 hover:border-[#c9a962]/30 hover:bg-white/[0.07] transition-all duration-300 cursor-pointer"
                >
                  {/* Logo */}
                  <div className="aspect-[3/2] flex items-center justify-center mb-4">
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10 rounded flex items-center justify-center group-hover:bg-white/15 transition-colors">
                        <span className="text-white/40 text-sm font-medium text-center px-2">
                          {partner.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Partner Info */}
                  <div className="text-center">
                    <p className="text-white/90 font-medium text-sm mb-1">{partner.name}</p>
                    <p className="text-[#c9a962] text-xs">{partner.category}</p>
                  </div>
                </motion.div>
              );

              return partner.website ? (
                <a
                  key={partner.id}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {PartnerCard}
                </a>
              ) : (
                PartnerCard
              );
            })}
          </motion.div>
        )}

        {/* CTA */}
        <div className="text-center border-t border-white/10 pt-12">
          <p className="text-white/50 mb-4">{t("cta.title")}</p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-[#c9a962] text-black font-medium rounded-lg hover:bg-[#d4b86a] transition-all"
          >
            {t("cta.button")}
          </Link>
        </div>
      </div>
    </main>
  );
}
