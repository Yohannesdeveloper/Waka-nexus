"use client";

import { useTranslations } from "next-intl";
import AnimatedSection from "@/app/components/AnimatedSection";

export default function Media() {
  const t = useTranslations("media");

  const pressMaterials = [
    t("materials.executiveSummary"),
    t("materials.founderProfile"),
    t("materials.brandingAssets"),
    t("materials.eventAnnouncements"),
  ];

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection delay={0}>
          <p className="font-medium tracking-[0.4em] uppercase text-[#00F0FF] mb-4">{t("subtitle")}</p>
          <h1 className="font-display text-4xl md:text-6xl font-light text-white mb-6">
            {t("title")}
          </h1>
          <p className="text-white/70 leading-relaxed text-lg mb-16 max-w-3xl">
            {t("description")}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <section className="glass border border-white/10 rounded-2xl p-8 md:p-10">
            <h2 className="font-display text-2xl md:text-3xl font-light text-white mb-6">
              {t("pressMaterials.title")}
            </h2>
            <p className="text-white/70 mb-8">
              {t("pressMaterials.description")}
            </p>
            <ul className="space-y-4 mb-10">
              {pressMaterials.map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-white/80 text-lg">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-white/10 pt-8">
              <p className="text-white/60 mb-2">{t("contactLabel")}</p>
              <a
                href={`mailto:${t("contactEmail")}`}
                className="text-[#00F0FF] hover:text-[#D4AF37] transition-colors text-lg"
              >
                {t("contactEmail")}
              </a>
            </div>
          </section>
        </AnimatedSection>
      </div>
    </main>
  );
}
