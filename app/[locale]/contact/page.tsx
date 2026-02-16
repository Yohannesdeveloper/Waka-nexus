"use client";

import { useTranslations } from "next-intl";
import { useState, FormEvent } from "react";

export default function Contact() {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await response.json().catch(() => ({}));

      if (response.ok) {
        setSubmitStatus("success");
        form.reset();
      } else {
        setSubmitStatus("error");
        setErrorMessage((json.details ?? json.error) || null);
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitStatus("error");
      setErrorMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4">{t("subtitle")}</p>
        <h1 className="font-display text-4xl md:text-6xl font-light text-white mb-6">
          {t("title")}
        </h1>
        <p className="text-white/60 mb-12 leading-relaxed">
          {t("description")}
        </p>

        {/* Contact Info Section */}
        <div className="mb-12 space-y-6">
          <h2 className="font-display text-xl font-light text-white mb-6">{t("info.title")}</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium tracking-widest uppercase text-[#c9a962] mb-1">
                {t("info.generalInquiries")}
              </p>
              <a
                href={`mailto:${t("info.generalEmail")}`}
                className="text-white/70 hover:text-[#c9a962] transition-colors"
              >
                {t("info.generalEmail")}
              </a>
            </div>

            <div>
              <p className="text-sm font-medium tracking-widest uppercase text-[#c9a962] mb-1">
                {t("info.sponsorship")}
              </p>
              <a
                href={`mailto:${t("info.sponsorshipEmail")}`}
                className="text-white/70 hover:text-[#c9a962] transition-colors"
              >
                {t("info.sponsorshipEmail")}
              </a>
            </div>

            <div>
              <p className="text-sm font-medium tracking-widest uppercase text-[#c9a962] mb-1">
                {t("info.artistSubmissions")}
              </p>
              <a
                href={`mailto:${t("info.artistEmail")}`}
                className="text-white/70 hover:text-[#c9a962] transition-colors"
              >
                {t("info.artistEmail")}
              </a>
            </div>

            <div>
              <p className="text-sm font-medium tracking-widest uppercase text-[#c9a962] mb-1">
                {t("info.phone")}
              </p>
              <a
                href="tel:+971506763752"
                className="text-white/70 hover:text-[#c9a962] transition-colors"
              >
                {t("info.phoneNumber")}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 my-12"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
              {t("form.name")} *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder={t("form.placeholder.name")}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
              {t("form.email")} *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder={t("form.placeholder.email")}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
              {t("form.subject")}
            </label>
            <select
              id="subject"
              name="subject"
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-[#c9a962]/50 transition-colors [&>option]:bg-[#0a0c12] [&>option]:text-white"
            >
              <option value="">{t("form.topic.label")}</option>
              <option value="exhibitions">{t("form.topic.exhibitions")}</option>
              <option value="competition">{t("form.topic.competition")}</option>
              <option value="partnerships">{t("form.topic.partnerships")}</option>
              <option value="investment">{t("form.topic.investment")}</option>
              <option value="media">{t("form.topic.media")}</option>
              <option value="other">{t("form.topic.other")}</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium tracking-widest uppercase text-white/70 mb-2">
              {t("form.message")} *
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              placeholder={t("form.placeholder.message")}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#c9a962] text-[#0a0c12] py-4 font-semibold tracking-widest uppercase text-sm hover:bg-[#d4b86a] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t("form.sending") : t("form.send")}
          </button>
        </form>

        {submitStatus === "success" && (
          <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center">
            {t("form.success")}
          </div>
        )}
        {submitStatus === "error" && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center space-y-1">
            <p>{t("form.error")}</p>
            {errorMessage && <p className="text-sm opacity-90">{errorMessage}</p>}
          </div>
        )}
      </div>
    </main>
  );
}
