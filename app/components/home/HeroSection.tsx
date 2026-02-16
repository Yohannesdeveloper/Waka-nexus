"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface HeroSectionProps {
  subtitle: string;
  title: string;
  tagline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaDownload: string;
}

export default function HeroSection({
  subtitle,
  title,
  tagline,
  ctaPrimary,
  ctaSecondary,
  ctaDownload,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-6 pt-28 pb-24 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[80vmax] h-[80vmax] rounded-full opacity-[0.22] blur-[120px] animate-orb-1"
          style={{
            left: "10%",
            top: "20%",
            background: "radial-gradient(circle, #c9a962 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute w-[60vmax] h-[60vmax] rounded-full opacity-[0.18] blur-[100px] animate-orb-2"
          style={{
            right: "5%",
            bottom: "15%",
            background: "radial-gradient(circle, #5A2EFF 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute w-[50vmax] h-[50vmax] rounded-full opacity-[0.15] blur-[90px] animate-orb-3"
          style={{
            left: "40%",
            bottom: "25%",
            background: "radial-gradient(circle, #00F0FF 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#5A2EFF]/08 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        <motion.p
          className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-8 text-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {subtitle}
        </motion.p>

        <motion.h1
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light mb-10 leading-[1.08] tracking-tight"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {title.includes(", ") ? (
            <>
              <span className="block text-white">{title.split(", ")[0]},</span>
              <span className="block text-gradient-animated mt-2">{title.split(", ").slice(1).join(", ")}</span>
            </>
          ) : (
            <span className="block text-white">{title}</span>
          )}
        </motion.h1>

        <motion.p
          className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed font-light"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {tagline}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link href="/apply" className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 overflow-hidden rounded-xl bg-[#c9a962] text-black font-semibold tracking-wide hover:shadow-[0_0_60px_rgba(201,169,98,0.45)] transition-all duration-300">
              <span className="relative flex items-center gap-2">
                {ctaPrimary}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </motion.div>

          <Link
            href="/partners"
            className="group relative inline-flex items-center justify-center gap-2 px-10 py-4 border border-[#c9a962]/50 text-[#c9a962] font-medium rounded-lg hover:bg-[#c9a962]/10 hover:border-[#c9a962]/80 hover:shadow-[0_0_40px_rgba(201,169,98,0.15)] transition-all duration-300"
          >
            {ctaSecondary}
          </Link>

          <a
            href="/api/executive-summary"
            download="WAKA-Executive-Summary.html"
            className="group relative inline-flex items-center justify-center gap-2 px-10 py-4 border border-white/30 text-white/90 font-medium rounded-lg hover:bg-white/5 hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all duration-300"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {ctaDownload}
          </a>
        </motion.div>

      </div>

      {/* Scroll indicator - fixed to section bottom */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          className="w-px h-10 rounded-full bg-gradient-to-b from-[#c9a962]/80 to-transparent animate-scroll-bounce"
          style={{ originY: 0 }}
        />
      </motion.div>
    </section>
  );
}
