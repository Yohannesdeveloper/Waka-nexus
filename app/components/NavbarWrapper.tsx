"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";
import { type Locale } from "@/i18n/config";
import { useTranslations } from "next-intl";

// Chevron Down Icon Component
function ChevronDownIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <motion.svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <path d="M2 4L6 8L10 4" />
    </motion.svg>
  );
}

// Stunning Logo Component
function Logo({ className = "", waka = "WAKA", nexus = "Nexus" }: { className?: string; waka?: string; nexus?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setSparkles(prev => [
          ...prev.slice(-5),
          { id: Date.now(), x: Math.random() * 100, y: Math.random() * 40 }
        ]);
      }, 150);
      return () => clearInterval(interval);
    } else {
      setSparkles([]);
    }
  }, [isHovered]);

  const letterVariants = {
    initial: { y: 0 },
    hover: (i: number) => ({
      y: [0, -4, 0],
      transition: {
        duration: 0.5,
        delay: i * 0.05,
        ease: [0.16, 1, 0.3, 1] as const,
        repeat: Infinity,
        repeatDelay: 1.5
      }
    })
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    hover: {
      opacity: 1,
      scale: 1.2,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  const wakaLetters = waka.split("");
  const nexusLetters = nexus.split("");

  return (
    <motion.div
      className={`relative flex items-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial="initial"
      animate={isHovered ? "hover" : "initial"}
    >
      {/* Background Glow */}
      <motion.div
        className="absolute -inset-4 rounded-full blur-2xl"
        variants={glowVariants}
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(0,240,255,0.15) 50%, transparent 70%)"
        }}
      />

      {/* Sparkles */}
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <motion.div
            key={sparkle.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              background: "linear-gradient(135deg, #D4AF37, #00F0FF, #ffffff)"
            }}
            initial={{ opacity: 1, scale: 0, rotate: 0 }}
            animate={{ opacity: 0, scale: 1.5, rotate: 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* WAKA Text */}
      <div className="relative flex">
        {wakaLetters.map((letter, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            className="font-display text-xl font-semibold tracking-tight text-white relative"
            style={{
              textShadow: isHovered
                ? "0 0 20px rgba(212,175,55,0.8), 0 0 40px rgba(212,175,55,0.4), 0 0 60px rgba(0,240,255,0.2)"
                : "0 0 10px rgba(212,175,55,0.3)"
            }}
          >
            <motion.span
              animate={isHovered ? {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text"
              style={{
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {letter}
            </motion.span>
          </motion.span>
        ))}
      </div>

      {/* Decorative Element */}
      <motion.div
        className="mx-2 relative"
        animate={isHovered ? {
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        } : {}}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" className="relative z-10">
          <defs>
            <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
          <motion.path
            d="M6 0L12 6L6 12L0 6Z"
            fill="url(#diamondGrad)"
            animate={isHovered ? {
              filter: ["drop-shadow(0 0 5px rgba(212,175,55,0.5))", "drop-shadow(0 0 15px rgba(0,240,255,0.8))", "drop-shadow(0 0 5px rgba(212,175,55,0.5))"]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>
        <motion.div
          className="absolute inset-0 blur-md"
          animate={isHovered ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.3 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M6 0L12 6L6 12L0 6Z" fill="#D4AF37" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Nexus Text */}
      <div className="relative flex">
        {nexusLetters.map((letter, i) => (
          <motion.span
            key={i}
            custom={i + wakaLetters.length}
            variants={letterVariants}
            className="font-display text-xl font-semibold tracking-tight relative"
            style={{
              textShadow: isHovered
                ? "0 0 20px rgba(0,240,255,0.8), 0 0 40px rgba(0,240,255,0.4), 0 0 60px rgba(212,175,55,0.2)"
                : "0 0 10px rgba(0,240,255,0.3)"
            }}
          >
            <motion.span
              animate={isHovered ? {
                backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
              } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="bg-gradient-to-r from-[#D4AF37] via-[#00F0FF] to-[#D4AF37] bg-clip-text"
              style={{
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {letter}
            </motion.span>
          </motion.span>
        ))}
      </div>

      {/* Underline Effect */}
      <motion.div
        className="absolute -bottom-1 left-0 right-0 h-[2px] origin-left"
        style={{
          background: "linear-gradient(90deg, transparent, #D4AF37, #00F0FF, #D4AF37, transparent)"
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isHovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Particle Trail */}
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 rounded-full bg-[#D4AF37]"
                initial={{
                  x: -20 + i * 15,
                  y: 10,
                  opacity: 0,
                  scale: 0
                }}
                animate={{
                  x: -30 + i * 20,
                  y: -20 + Math.random() * 40,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface NavLink {
  href: string;
  label: string;
}

interface NavbarWrapperProps {
  navLinks: NavLink[];
  user: { name: string; role: string } | null;
  locale: Locale;
}

export default function NavbarWrapper({ navLinks, user, locale }: NavbarWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [artistsDropdownOpen, setArtistsDropdownOpen] = useState(false);
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  const getDashboardLink = () => {
    if (!user) return "/auth/login";
    if (user.role === "jury") return "/jury";
    if (user.role === "admin") return "/admin";
    return "/artist/dashboard";
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6 xl:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="relative flex-shrink-0 mr-4" data-cursor-hover>
            <Logo waka={tc("logoWaka")} nexus={tc("logoNexus")} />
          </Link>

          <div className="hidden lg:flex items-center gap-3 xl:gap-5">
            {navLinks.map((link) => {
              // Artists dropdown menu
              if (link.href === "/artists") {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setArtistsDropdownOpen(true)}
                    onMouseLeave={() => setArtistsDropdownOpen(false)}
                  >
                    <button
                      className="link-underline flex items-center gap-1 text-[8px] xl:text-[9px] font-medium tracking-[0.15em] uppercase text-white/80 hover:text-[#D4AF37] transition-colors duration-300 whitespace-nowrap"
                      data-cursor-hover
                    >
                      {link.label}
                      <ChevronDownIcon isOpen={artistsDropdownOpen} />
                    </button>
                    <AnimatePresence>
                      {artistsDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 py-2 px-4 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg min-w-[200px]"
                        >
                          <Link
                            href="/artists"
                            className="block py-2 text-xs font-medium tracking-widest uppercase text-white/80 hover:text-[#D4AF37] transition-colors"
                            onClick={() => setArtistsDropdownOpen(false)}
                          >
                            {t("artists")}
                          </Link>
                          <Link
                            href="/news-events"
                            className="block py-2 text-xs font-medium tracking-widest uppercase text-white/80 hover:text-[#D4AF37] transition-colors"
                            onClick={() => setArtistsDropdownOpen(false)}
                          >
                            {t("newsEvents")}
                          </Link>
                          <Link
                            href="/competition"
                            className="block py-2 text-xs font-medium tracking-widest uppercase text-white/80 hover:text-[#D4AF37] transition-colors"
                            onClick={() => setArtistsDropdownOpen(false)}
                          >
                            {t("competition")}
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="link-underline text-[8px] xl:text-[9px] font-medium tracking-[0.15em] uppercase text-white/80 hover:text-[#D4AF37] transition-colors duration-300 whitespace-nowrap"
                  data-cursor-hover
                >
                  {link.label}
                </Link>
              );
            })}

            <LanguageSwitcher currentLocale={locale} />

            {user ? (
              <Link href={getDashboardLink()} data-cursor-hover>
                <motion.span
                  className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] px-4 py-1.5 text-xs font-medium tracking-widest uppercase hover:bg-[#D4AF37]/30 transition-all duration-300 rounded-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {user.name}
                </motion.span>
              </Link>
            ) : (
              <>
                <Link href="/auth/login" data-cursor-hover>
                  <motion.span
                    className="inline-block text-white/80 px-4 py-1.5 text-xs font-medium tracking-widest uppercase hover:text-[#D4AF37] transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("login")}
                  </motion.span>
                </Link>
                <Link href="/apply" data-cursor-hover>
                  <motion.span
                    className="inline-block border border-[#D4AF37]/60 text-[#D4AF37] px-4 py-1.5 text-xs font-medium tracking-widest uppercase hover:bg-[#D4AF37]/10 hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] transition-all duration-300 rounded-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("submitArtwork")}
                  </motion.span>
                </Link>
              </>
            )}
          </div>

          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white/90 hover:text-[#00F0FF] rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden overflow-hidden border-t border-white/10"
            >
              <div className="flex flex-col gap-2 py-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-2 text-white/80 hover:text-[#D4AF37] font-medium tracking-widest uppercase transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                {user ? (
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-[#D4AF37] font-medium tracking-widest uppercase"
                  >
                    {user.name}
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsOpen(false)}
                      className="block py-2 text-white/80 hover:text-[#D4AF37] font-medium tracking-widest uppercase transition-colors"
                    >
                      {t("login")}
                    </Link>
                    <Link
                      href="/apply"
                      onClick={() => setIsOpen(false)}
                      className="block py-2 text-[#D4AF37] font-medium tracking-widest uppercase"
                    >
                      {t("submitArtwork")}
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 -z-10 glass-glow border-b border-white/5" />
    </motion.nav>
  );
}
