import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getEvents, getNews } from "@/lib/submissions";
import { isAdminAuthenticated } from "@/lib/admin-actions";
import AdminLogin from "../components/AdminLogin";
import ContentManager from "./components/ContentManager";

export default async function CMSPage() {
  const isAuthenticated = await isAdminAuthenticated();
  const t = await getTranslations("admin.cms");

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const [events, news] = await Promise.all([getEvents(), getNews()]);

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4">{t("subtitle")}</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-4">
              {t("title")}
            </h1>
            <p className="text-white/60 max-w-2xl">
              {t("description")}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/cms/partners"
              className="px-4 py-2 rounded-lg font-medium text-sm bg-[#c9a962] text-black hover:bg-[#d4b86a] transition-all text-center"
            >
              {t("buttons.managePartners")}
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 rounded-lg font-medium text-sm bg-white/10 text-white hover:bg-white/20 transition-all text-center"
            >
              {t("buttons.backToAdmin")}
            </Link>
          </div>
        </div>

        <ContentManager events={events} news={news} />
      </div>
    </main>
  );
}
