"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  index?: number;
}

export default function ServiceCard({ title, description, href, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link href={href} className="block h-full">
        <div className="relative h-full bg-white/[0.03] border border-white/10 rounded-2xl p-8 md:p-10 transition-all duration-500 overflow-hidden hover:border-[#c9a962]/40 hover:bg-white/[0.05] hover:shadow-[0_0_60px_-20px_rgba(201,169,98,0.15)]">
          {/* Shine overlay on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
            }}
          />
          <div className="relative">
            <h3 className="font-display text-xl md:text-2xl font-medium text-white mb-5 group-hover:text-[#c9a962] transition-colors duration-300">
              {title}
            </h3>
            <p className="text-white/60 leading-relaxed text-[15px] md:text-base">
              {description}
            </p>
            <span className="inline-flex items-center gap-2 mt-8 text-[#c9a962] font-medium text-sm group-hover:gap-4 transition-all duration-300">
              Learn more
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a962]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
          />
        </div>
      </Link>
    </motion.div>
  );
}
