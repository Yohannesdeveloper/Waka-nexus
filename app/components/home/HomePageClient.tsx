"use client";

import Link from "next/link";
import HeroSection from "./HeroSection";
import AnimatedSection from "./AnimatedSection";
import ServiceCard from "./ServiceCard";
import GradientDivider from "./GradientDivider";

export interface HomePageContent {
  hero: {
    subtitle: string;
    title: string;
    tagline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaDownload: string;
  };
  about: {
    subtitle: string;
    title: string;
    description: string;
  };
  whatWeDo: {
    subtitle: string;
    title: string;
    exhibitions: { title: string; description: string };
    competition: { title: string; description: string };
    dialogue: { title: string; description: string };
  };
  approach: {
    subtitle: string;
    title: string;
    points: { governed: string; inclusive: string; scalable: string; collaboration: string };
  };
}

export default function HomePageClient({ content }: { content: HomePageContent }) {
  const { hero, about, whatWeDo, approach } = content;
  const approachKeys = ["governed", "inclusive", "scalable", "collaboration"] as const;

  return (
    <main>
      <HeroSection
        subtitle={hero.subtitle}
        title={hero.title}
        tagline={hero.tagline}
        ctaPrimary={hero.ctaPrimary}
        ctaSecondary={hero.ctaSecondary}
        ctaDownload={hero.ctaDownload}
      />

      <div className="px-6">
        <GradientDivider />
      </div>

      <AnimatedSection className="py-28 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4 text-sm">
            {about.subtitle}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-white mb-10">
            {about.title}
          </h2>
          <p className="text-white/70 leading-relaxed text-lg">
            {about.description}
          </p>
        </div>
      </AnimatedSection>

      <section className="py-28 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection delay={0}>
            <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4 text-sm">
              {whatWeDo.subtitle}
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-white mb-20">
              {whatWeDo.title}
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <ServiceCard
              title={whatWeDo.exhibitions.title}
              description={whatWeDo.exhibitions.description}
              href="/exhibitions"
              index={0}
            />
            <ServiceCard
              title={whatWeDo.competition.title}
              description={whatWeDo.competition.description}
              href="/competition"
              index={1}
            />
            <ServiceCard
              title={whatWeDo.dialogue.title}
              description={whatWeDo.dialogue.description}
              href="/media"
              index={2}
            />
          </div>
        </div>
      </section>

      <AnimatedSection className="py-28 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4 text-sm">
            {approach.subtitle}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-white mb-14">
            {approach.title}
          </h2>
          <ul className="space-y-5">
            {approachKeys.map((key, i) => (
              <li
                key={key}
                className="flex items-start gap-4 text-white/70 text-lg group"
              >
                <span className="text-[#c9a962] mt-1.5 font-display text-xl group-hover:scale-110 transition-transform">
                  —
                </span>
                <span>{approach.points[key]}</span>
              </li>
            ))}
          </ul>
          <div className="mt-16 text-center">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-10 py-4 border border-[#c9a962]/60 text-[#c9a962] font-medium rounded-lg hover:bg-[#c9a962]/10 hover:border-[#c9a962]/80 hover:shadow-[0_0_40px_rgba(201,169,98,0.12)] transition-all duration-300"
            >
              Get in touch
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
