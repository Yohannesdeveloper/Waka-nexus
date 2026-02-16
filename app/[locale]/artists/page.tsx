"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Artists() {
  const t = useTranslations("artists");

  const disciplines = [
    t("disciplines.painting"),
    t("disciplines.sculpture"),
    t("disciplines.photography"),
    t("disciplines.mixedMedia"),
    t("disciplines.digitalArt"),
    t("disciplines.installation"),
  ];

  const criteria = [
    t("criteria.creativity"),
    t("criteria.technicalExecution"),
    t("criteria.originality"),
    t("criteria.conceptualImpact"),
  ];

  const benefits = [
    t("benefits.exhibitionExposure"),
    t("benefits.professionalRecognition"),
    t("benefits.mediaVisibility"),
    t("benefits.networkingOpportunities"),
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

        {/* Eligible Disciplines Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-display text-2xl md:text-3xl font-light text-white mb-6">
            {t("eligibleDisciplines")}
          </h2>
          <ul className="space-y-3">
            {disciplines.map((discipline, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-white/70"
              >
                <span className="text-[#c9a962]">•</span>
                <span>{discipline}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Divider */}
        <div className="border-t border-white/10 my-12"></div>

        {/* Selection Process Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="font-display text-2xl md:text-3xl font-light text-white mb-6">
            {t("selectionProcess")}
          </h2>
          <p className="text-white/70 mb-4">{t("selectionDescription")}</p>
          <ul className="space-y-3">
            {criteria.map((criterion, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-white/70"
              >
                <span className="text-[#c9a962]">•</span>
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Divider */}
        <div className="border-t border-white/10 my-12"></div>

        {/* Selected Artists Receive Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="font-display text-2xl md:text-3xl font-light text-white mb-6">
            {t("selectedArtistsReceive")}
          </h2>
          <ul className="space-y-3">
            {benefits.map((benefit, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-white/70"
              >
                <span className="text-[#c9a962]">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Submit Application Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-16"
        >
          <Link
            href="/apply"
            className="inline-block px-8 py-3 bg-[#c9a962] text-black font-medium rounded-lg hover:bg-[#d4b86a] transition-all"
          >
            {t("submitApplication")}
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
            href="/apply"
            className="inline-block px-8 py-3 bg-[#c9a962] text-black font-medium rounded-lg hover:bg-[#d4b86a] transition-all"
          >
            {t("cta.button")}
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
