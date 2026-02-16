"use client";

import { useTranslations } from "next-intl";
import AnimatedSection from "@/app/components/AnimatedSection";

export default function JuryGovernance() {
  const t = useTranslations("juryGovernance");

  const jurySystemPoints = [
    t("independentJury.evaluationCriteria"),
    t("independentJury.scoringProcess"),
    t("independentJury.conflictPolicy"),
    t("independentJury.geographicDiversity"),
  ];

  const ethicalStandardsPoints = [
    t("ethicalStandards.intellectualProperty"),
    t("ethicalStandards.nonDiscriminatory"),
    t("ethicalStandards.culturalSensitivity"),
    t("ethicalStandards.financialTransparency"),
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

        <div className="space-y-16">
          {/* Independent Jury System */}
          <AnimatedSection delay={0.1}>
            <section className="glass border border-white/10 rounded-2xl p-8 md:p-10">
              <h2 className="font-display text-2xl md:text-3xl font-light text-white mb-6">
                {t("independentJury.title")}
              </h2>
              <ul className="space-y-4">
                {jurySystemPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-4 text-white/80 text-lg">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          </AnimatedSection>

          {/* Ethical Standards */}
          <AnimatedSection delay={0.2}>
            <section className="glass border border-white/10 rounded-2xl p-8 md:p-10">
              <h2 className="font-display text-2xl md:text-3xl font-light text-white mb-6">
                {t("ethicalStandards.title")}
              </h2>
              <ul className="space-y-4">
                {ethicalStandardsPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-4 text-white/80 text-lg">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          </AnimatedSection>

          {/* Closing Statement */}
          <AnimatedSection delay={0.3}>
            <section className="text-center py-8">
              <p className="text-white/60 text-lg italic">
                {t("closingStatement")}
              </p>
            </section>
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
