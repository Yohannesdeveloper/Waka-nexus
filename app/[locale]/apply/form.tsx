"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { submitArtwork } from "@/lib/apply-actions";

export function SubmitArtworkForm() {
  const t = useTranslations("apply");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await submitArtwork(null, formData);
      console.log("Submit result:", result);

      if (result?.success) {
        setMessage({ type: 'success', text: t("messages.success") });
        form.reset();
      } else {
        setMessage({ type: 'error', text: result?.error || t("messages.error") });
      }
    } catch (error) {
      console.error("Submit catch error:", error);
      setMessage({ type: 'error', text: t("messages.error") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {message && (
        <div className={`mb-8 p-6 rounded-lg border ${message.type === 'success'
            ? 'border-[#c9a962]/40 bg-[#c9a962]/10 text-[#c9a962]'
            : 'border-red-500/40 bg-red-500/10 text-red-400'
          }`}>
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="artistName" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
            {t("form.artistName")}
          </label>
          <input
            id="artistName"
            name="artistName"
            type="text"
            placeholder={t("form.placeholder.artistName")}
            required
            disabled={isSubmitting}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
            {t("form.email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder={t("form.placeholder.email")}
            required
            disabled={isSubmitting}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
            {t("form.country")}
          </label>
          <input
            id="country"
            name="country"
            type="text"
            placeholder={t("form.placeholder.country")}
            required
            disabled={isSubmitting}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="artworkTitle" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
            {t("form.artworkTitle")}
          </label>
          <input
            id="artworkTitle"
            name="artworkTitle"
            type="text"
            placeholder={t("form.placeholder.artworkTitle")}
            disabled={isSubmitting}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="images" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
            {t("form.images")}
          </label>
          <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-[#c9a962]/40 transition-colors">
            <input
              id="images"
              name="images"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              multiple
              required
              disabled={isSubmitting}
              className="block w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#c9a962]/20 file:text-[#c9a962] file:cursor-pointer"
            />
            <p className="mt-2 text-sm text-white/50">{t("form.fileHelp")}</p>
          </div>
        </div>
        <div>
          <label htmlFor="statement" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
            {t("form.statement")}
          </label>
          <textarea
            id="statement"
            name="statement"
            rows={5}
            placeholder={t("form.placeholder.statement")}
            disabled={isSubmitting}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors resize-none disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#c9a962] text-[#0a0c12] py-4 font-semibold tracking-widest uppercase text-sm hover:bg-[#d4b86a] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isSubmitting ? t("form.submitting") : t("form.submit")}
        </button>
      </form>
    </>
  );
}
