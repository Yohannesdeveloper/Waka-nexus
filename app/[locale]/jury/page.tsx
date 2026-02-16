import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getCurrentUser, logoutUser } from "@/lib/auth-actions";
import { getJurySubmissions, getJuryScoredSubmissions, getJuryStats } from "@/lib/jury-actions";
import JuryReviewForm from "./components/JuryReviewForm";

export default async function JuryPortal() {
  const user = await getCurrentUser();
  const t = await getTranslations("jury.portal");

  // Redirect to jury login if not authenticated or not a jury member
  if (!user || user.role !== "jury") {
    redirect("/auth/jury");
  }

  const [submissions, scoredSubmissions, stats] = await Promise.all([
    getJurySubmissions(),
    getJuryScoredSubmissions(),
    getJuryStats(),
  ]);

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4">{t("subtitle")}</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-4">
              {t("title")}, {user.name}
            </h1>
            <p className="text-white/60 max-w-2xl">
              {t("description")}
            </p>
          </div>
          <form action={async () => {
            "use server";
            await logoutUser();
            redirect("/");
          }}>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-medium text-sm bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              {t("logout")}
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <p className="text-white/60 text-sm mb-2">{t("stats.pendingReview")}</p>
            <p className="text-3xl font-bold text-yellow-400">{stats.totalPending}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <p className="text-white/60 text-sm mb-2">{t("stats.scored")}</p>
            <p className="text-3xl font-bold text-green-400">{stats.totalScored}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <p className="text-white/60 text-sm mb-2">{t("stats.total")}</p>
            <p className="text-3xl font-bold text-[#c9a962]">{stats.totalPending + stats.totalScored}</p>
          </div>
        </div>

        {/* Pending Reviews */}
        <section className="mb-16">
          <h2 className="font-display text-2xl font-medium text-white mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
            {t("pending.title")} ({stats.totalPending})
          </h2>

          {submissions.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/60">{t("pending.empty")}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {submissions.map((submission) => (
                <JuryReviewForm key={submission.id} submission={submission} />
              ))}
            </div>
          )}
        </section>

        {/* Already Scored */}
        <section>
          <h2 className="font-display text-2xl font-medium text-white mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            {t("scored.title")} ({stats.totalScored})
          </h2>

          {scoredSubmissions.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/60">{t("scored.empty")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scoredSubmissions.map((score) => (
                <div
                  key={score.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-6"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Images */}
                    <div className="flex gap-2 overflow-x-auto md:w-48">
                      {score.submission.imageUrls.slice(0, 3).map((url: string, i: number) => (
                        <img
                          key={i}
                          src={url}
                          alt={`Submission ${i + 1}`}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {t("submission.anonymous")} #{score.submission.anonymousId}
                        </h3>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-[#c9a962]/20 text-[#c9a962]">
                          {t("score.label")}: {score.total}/40
                        </span>
                      </div>
                      <p className="text-white/40 text-sm mb-3">
                        {score.submission.country}
                      </p>

                      {/* Score Breakdown */}
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="bg-white/5 rounded p-2 text-center">
                          <p className="text-white/40 text-xs">{t("scoring.creativity")}</p>
                          <p className="text-white font-medium">{score.creativity}/10</p>
                        </div>
                        <div className="bg-white/5 rounded p-2 text-center">
                          <p className="text-white/40 text-xs">{t("scoring.technique")}</p>
                          <p className="text-white font-medium">{score.technique}/10</p>
                        </div>
                        <div className="bg-white/5 rounded p-2 text-center">
                          <p className="text-white/40 text-xs">{t("scoring.concept")}</p>
                          <p className="text-white font-medium">{score.concept}/10</p>
                        </div>
                        <div className="bg-white/5 rounded p-2 text-center">
                          <p className="text-white/40 text-xs">{t("scoring.presentation")}</p>
                          <p className="text-white font-medium">{score.presentation}/10</p>
                        </div>
                      </div>

                      {score.comments && (
                        <div className="mt-4 bg-white/5 rounded p-3">
                          <p className="text-white/40 text-xs mb-1">{t("scored.yourComments")}</p>
                          <p className="text-white/80 text-sm">{score.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
