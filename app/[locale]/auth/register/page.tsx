"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { registerUser } from "@/lib/auth-actions";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("auth.register");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError(t("error.passwordMismatch"));
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t("error.passwordLength"));
      setIsLoading(false);
      return;
    }

    try {
      const result = await registerUser({
        email: formData.get("email") as string,
        password,
        name: formData.get("name") as string,
        country: formData.get("country") as string,
      });

      if (result.success) {
        router.push("/auth/login?registered=true");
      } else {
        setError(result.error || t("error.default"));
      }
    } catch (err) {
      setError(t("error.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 bg-black flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4">{t("title")}</p>
          <h1 className="font-display text-3xl md:text-4xl font-light text-white mb-4">
            {t("subtitle")}
          </h1>
          <p className="text-white/60">
            {t("description")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 rounded-lg border border-red-500/40 bg-red-500/10 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
              {t("name")} *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              disabled={isLoading}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
              {t("email")} *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={isLoading}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
              {t("country")}
            </label>
            <input
              id="country"
              name="country"
              type="text"
              disabled={isLoading}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
              {t("password")} *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              disabled={isLoading}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors disabled:opacity-50"
            />
            <p className="text-white/40 text-xs mt-1">{t("passwordHint")}</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
              {t("confirmPassword")} *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              disabled={isLoading}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#c9a962] text-[#0a0c12] py-4 font-semibold tracking-widest uppercase text-sm hover:bg-[#d4b86a] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-4"
          >
            {isLoading ? t("submitting") : t("submit")}
          </button>
        </form>

        <p className="mt-8 text-center text-white/60">
          {t("hasAccount")}{" "}
          <Link href="/auth/login" className="text-[#c9a962] hover:underline">
            {t("login")}
          </Link>
        </p>
      </div>
    </main>
  );
}
