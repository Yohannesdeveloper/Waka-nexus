"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  external?: boolean;
};

export default function LuxuryButton({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  external = false,
}: Props) {
  const base =
    "group inline-flex items-center justify-center gap-3 font-semibold tracking-[0.2em] uppercase text-sm py-4 px-10 rounded-sm overflow-hidden relative transition-all duration-400 cursor-pointer";

  const variants = {
    primary:
      "bg-[#5A2EFF] text-white border border-[#5A2EFF] hover:border-[#00F0FF] hover:shadow-[0_0_40px_rgba(0,240,255,0.4),0_0_80px_rgba(90,46,255,0.3)] hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      "bg-transparent text-white border border-white/30 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:scale-[1.02] active:scale-[0.98]",
    ghost:
      "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-[#00F0FF]/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] hover:scale-[1.02] active:scale-[0.98]",
  };

  const content = (
    <>
      <span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
        style={{ transform: "skewX(-15deg)" }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  const buttonClass = `${base} ${variants[variant]} ${className}`;

  if (href && !onClick) {
    return (
      <Link href={href} className={buttonClass} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
        {content}
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      className={buttonClass}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {content}
    </motion.button>
  );
}
