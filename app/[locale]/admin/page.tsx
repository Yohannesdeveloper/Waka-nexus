import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getSubmissions } from "@/lib/submissions";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import { isAdminAuthenticated, logoutAdmin } from "@/lib/admin-actions";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const isAuthenticated = await isAdminAuthenticated();
  const t = await getTranslations("admin.dashboard");

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const submissions = await getSubmissions();

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4">{t("subtitle")}</p>
            <h1 className="font-display text-4xl md:text-6xl font-light text-white mb-6">
              {t("title")}
            </h1>
            <p className="text-white/60 max-w-2xl leading-relaxed">
              {t("description")}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/admin/cms"
              className="px-4 py-2 rounded-lg font-medium text-sm bg-[#c9a962] text-black hover:bg-[#d4b86a] transition-all"
            >
              {t("buttons.contentManager")}
            </Link>
            <Link
              href="/admin/cms/partners"
              className="px-4 py-2 rounded-lg font-medium text-sm bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              {t("buttons.managePartners")}
            </Link>
            <Link
              href="/admin/cms?tab=events"
              className="px-4 py-2 rounded-lg font-medium text-sm bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              {t("buttons.uploadCompetition")}
            </Link>
            <form action={async () => {
              "use server";
              await logoutAdmin();
              redirect("/admin");
            }}>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg font-medium text-sm bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                {t("buttons.logout")}
              </button>
            </form>
          </div>
        </div>

        <AdminDashboard submissions={submissions} />
      </div>
    </main>
  );
}

