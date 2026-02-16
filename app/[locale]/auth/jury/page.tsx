"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { loginUser } from "@/lib/auth-actions";

export default function JuryLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await loginUser(email, password);

      if (result.success) {
        // Redirect to jury portal on successful login
        router.push("/jury");
        router.refresh();
      } else {
        setError(result.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4">Jury Portal</p>
          <h1 className="font-display text-3xl md:text-4xl font-light text-white mb-4">
            Jury Login
          </h1>
          <p className="text-white/60">
            Access the submission review portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg border border-red-500/40 bg-red-500/10 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#c9a962] text-[#0a0c12] py-4 font-semibold tracking-widest uppercase text-sm hover:bg-[#d4b86a] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? "Signing in..." : "Access Jury Portal"}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <Link
            href="/auth/login"
            className="text-white/50 hover:text-[#c9a962] text-sm transition-colors block"
          >
            Artist Login →
          </Link>
          <Link
            href="/admin"
            className="text-white/50 hover:text-[#c9a962] text-sm transition-colors block"
          >
            Admin Login →
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
