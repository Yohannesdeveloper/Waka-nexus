import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-actions";
import { SubmitArtworkForm } from "./form";
import { getTranslations } from "next-intl/server";

export default async function Apply() {
  const user = await getCurrentUser();
  const t = await getTranslations("apply");

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/auth/login?redirect=/apply");
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

        <SubmitArtworkForm />

        <p className="mt-8 text-center text-white/40 text-sm">
          {t("footer.questions")}{" "}
          <Link href="/contact" className="text-[#c9a962] hover:underline">{t("footer.contact")}</Link>
        </p>
      </div>
    </main>
  );
}