"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { submitScore } from "@/lib/jury-actions";

interface Submission {
  id: string;
  anonymousId: string | null;
  artworkTitle: string | null;
  statement: string | null;
  imageUrls: string[];
  country: string;
}

interface JuryReviewFormProps {
  submission: Submission;
}

export default function JuryReviewForm({ submission }: JuryReviewFormProps) {
  const router = useRouter();
  const t = useTranslations("jury.portal.scoring");
  const tc = useTranslations("common");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      submissionId: submission.id,
      creativity: parseInt(formData.get("creativity") as string),
      technique: parseInt(formData.get("technique") as string),
      concept: parseInt(formData.get("concept") as string),
      presentation: parseInt(formData.get("presentation") as string),
      comments: formData.get("comments") as string,
    };

    try {
      const result = await submitScore(data);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || t("failed"));
        setIsSubmitting(false);
      }
    } catch (err) {
      setError(t("error"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      {/* Preview */}
      <div
        className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {submission.imageUrls[0] && (
              <img
                src={submission.imageUrls[0]}
                alt="Submission"
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold text-white">
                {t("anonymous")} #{submission.anonymousId}
              </h3>
              <p className="text-white/40 text-sm">{submission.country}</p>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-white/40 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded Review Form */}
      {isExpanded && (
        <div className="border-t border-white/10 p-6">
          {/* Images */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {submission.imageUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Image ${i + 1}`}
                className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
              />
            ))}
          </div>

          {/* Statement */}
          {submission.statement && (
            <div className="mb-6 bg-white/5 rounded-lg p-4">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">{t("artistStatement")}</p>
              <p className="text-white/80 text-sm">{submission.statement}</p>
            </div>
          )}

          {/* Scoring Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  {t("creativity")} <span className="text-white/30">(1-10)</span>
                </label>
                <input
                  name="creativity"
                  type="number"
                  min="1"
                  max="10"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-center focus:border-[#c9a962]/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  {t("technique")} <span className="text-white/30">(1-10)</span>
                </label>
                <input
                  name="technique"
                  type="number"
                  min="1"
                  max="10"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-center focus:border-[#c9a962]/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  {t("concept")} <span className="text-white/30">(1-10)</span>
                </label>
                <input
                  name="concept"
                  type="number"
                  min="1"
                  max="10"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-center focus:border-[#c9a962]/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  {t("presentation")} <span className="text-white/30">(1-10)</span>
                </label>
                <input
                  name="presentation"
                  type="number"
                  min="1"
                  max="10"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-center focus:border-[#c9a962]/50 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-2">
                {t("comments")} ({tc("optional")})
              </label>
              <textarea
                name="comments"
                rows={3}
                placeholder={t("placeholder")}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-[#c9a962]/50 outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-[#c9a962] text-black rounded-lg hover:bg-[#d4b86a] transition-all disabled:opacity-50 font-medium"
              >
                {isSubmitting ? t("submitting") : t("submit")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
