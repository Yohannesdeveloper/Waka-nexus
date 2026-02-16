"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { loginAdmin } from "@/lib/admin-actions";

export default function AdminLogin() {
  const router = useRouter();
  const t = useTranslations("admin.login");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await loginAdmin(password);

      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || t("error.invalid"));
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
          <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4">{t("subtitle")}</p>
          <h1 className="font-display text-3xl md:text-4xl font-light text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-white/60">
            {t("description")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg border border-red-500/40 bg-red-500/10 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
              {t("password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("placeholder")}
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
            {isLoading ? t("submitting") : t("submit")}
          </button>
        </form>
      </div>
    </main>
  );
}
