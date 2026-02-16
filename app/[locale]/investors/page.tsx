"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Investors() {
  const t = useTranslations("investors");

  const capitalItems = [
    t("capitalItems.exhibitionProduction"),
    t("capitalItems.operationalInfrastructure"),
    t("capitalItems.governanceFramework"),
    t("capitalItems.marketingOutreach"),
    t("capitalItems.internationalCoordination"),
  ];

  const growthItems = [
    t("growthItems.multiCityExpansion"),
    t("growthItems.sponsorshipRevenue"),
    t("growthItems.institutionalCollaboration"),
    t("growthItems.recurringEditions"),
  ];

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4">
            {t("subtitle")}
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-light text-white mb-6">
            {t("title")}
          </h1>
          <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Use of Capital Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-display text-2xl md:text-3xl font-light text-white mb-6">
            {t("useOfCapital")}
          </h2>
          <ul className="space-y-3">
            {capitalItems.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-white/70"
              >
                <span className="text-[#c9a962]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Divider */}
        <div className="border-t border-white/10 my-12"></div>

        {/* Growth Model Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="font-display text-2xl md:text-3xl font-light text-white mb-6">
            {t("growthModel")}
          </h2>
          <ul className="space-y-3">
            {growthItems.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-white/70"
              >
                <span className="text-[#c9a962]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Divider */}
        <div className="border-t border-white/10 my-12"></div>

        {/* Closing Statement */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <p className="text-white/70 leading-relaxed max-w-3xl">
            {t("closingStatement")}
          </p>
        </motion.section>

        {/* Request Investment Deck Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-16"
        >
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-[#c9a962] text-black font-medium rounded-lg hover:bg-[#d4b86a] transition-all"
          >
            {t("requestDeck")}
          </Link>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center border-t border-white/10 pt-12"
        >
          <p className="text-white/50 mb-4">{t("cta.title")}</p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-[#c9a962] text-black font-medium rounded-lg hover:bg-[#d4b86a] transition-all"
          >
            {t("cta.button")}
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
