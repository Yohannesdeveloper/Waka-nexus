"use client";

import { motion } from "framer-motion";

export default function GradientDivider() {
  return (
    <motion.div
      className="w-full h-px overflow-hidden"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ originX: 0 }}
    >
      <div
        className="h-full w-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(201,169,98,0.2), rgba(0,240,255,0.15), rgba(201,169,98,0.2), transparent)",
        }}
      />
    </motion.div>
  );
}
