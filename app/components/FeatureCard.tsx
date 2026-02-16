"use client";

import { motion } from "framer-motion";

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
};

export default function FeatureCard({ icon, title, description, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
      className="group relative rounded-2xl p-8 glass-glow border border-white/10 hover:border-[#D4AF37]/30 hover:shadow-[0_0_50px_rgba(212,175,55,0.08),0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A2EFF]/5 via-transparent to-[#00F0FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <motion.div
          className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/5 border border-white/10 text-[#00F0FF] group-hover:text-[#D4AF37] group-hover:border-[#D4AF37]/30 transition-colors duration-300"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {icon}
        </motion.div>
        <h3 className="font-display text-2xl font-semibold text-white mb-3 tracking-tight">
          {title}
        </h3>
        <p className="text-white/60 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
