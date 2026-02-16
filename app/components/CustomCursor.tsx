"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
      const target = e.target as HTMLElement;
      setIsHovering(!!target?.closest("a, button, [data-cursor-hover]"));
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  if (typeof window === "undefined" || !isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isHovering ? 1.8 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
        style={{ x: "-50%", y: "-50%" }}
      >
        <div
          className={`rounded-full transition-all duration-300 ${
            isHovering
              ? "w-8 h-8 border-2 border-[#00F0FF] bg-[#00F0FF]/10"
              : "w-4 h-4 border border-[#D4AF37]/80 bg-transparent"
          }`}
          style={{
            boxShadow: isHovering ? "0 0 30px rgba(0, 240, 255, 0.5)" : "0 0 15px rgba(212, 175, 55, 0.3)",
          }}
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
        style={{ x: "-50%", y: "-50%" }}
      >
        <div
          className="w-2 h-2 rounded-full bg-[#00F0FF] opacity-60"
          style={{ boxShadow: "0 0 20px rgba(0, 240, 255, 0.8)" }}
        />
      </motion.div>
    </>
  );
}
