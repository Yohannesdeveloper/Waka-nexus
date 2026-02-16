"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

const PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=750&fit=crop",
];

type Props = {
  title: string;
  image: string;
  country: string;
  delay?: number;
};

export default function ExhibitionCard({ title, image, country, delay = 0 }: Props) {
  const [imgSrc, setImgSrc] = useState(image);
  const handleError = () => setImgSrc(PLACEHOLDERS[Math.floor(Math.random() * 3)]);

  return (
    <Link href="/exhibitions" className="group block" data-cursor-hover>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -8 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-500 hover:border-[#D4AF37]/30 hover:shadow-[0_0_50px_rgba(212,175,55,0.08),0_20px_60px_rgba(0,0,0,0.4)]"
      >
        <div className="aspect-[4/5] relative overflow-hidden">
          <motion.img
            src={imgSrc}
            alt={title}
            onError={handleError}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#5A2EFF]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-[#00F0FF] text-xs font-medium tracking-[0.3em] uppercase mb-2">{country}</p>
            <h3 className="font-display text-2xl font-medium text-white group-hover:text-[#D4AF37] transition-colors duration-300">
              {title}
            </h3>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
