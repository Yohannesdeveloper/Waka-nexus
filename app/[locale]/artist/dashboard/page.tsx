import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, logoutUser } from "@/lib/auth-actions";
import { prisma } from "@/lib/db";
import { LogOut } from "lucide-react";
import { getTranslations } from "next-intl/server";

async function getArtistSubmissions(userId: string) {
  return prisma.submission.findMany({
    where: { artistId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      scores: {
        include: {
          jury: {
            select: { name: true }
          }
        }
      }
    }
  });
}

async function getArtistProfile(userId: string) {
  return prisma.artistProfile.findUnique({
    where: { userId },
  });
}

export default async function ArtistDashboard() {
  const user = await getCurrentUser();
  const t = await getTranslations("artist.dashboard");

  // Redirect to login if not authenticated or not an artist
  if (!user || user.role !== "artist") {
    redirect("/auth/login");
  }

  const [submissions, profile] = await Promise.all([
    getArtistSubmissions(user.id),
    getArtistProfile(user.id),
  ]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "approved": return "bg-green-500/20 text-green-400";
      case "rejected": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex justify-between items-start">
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
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
            >
              <LogOut size={18} />
              <span>{t("logout")}</span>
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <p className="text-white/60 text-sm mb-2">{t("stats.totalSubmissions")}</p>
            <p className="text-3xl font-bold text-white">{submissions.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <p className="text-white/60 text-sm mb-2">{t("stats.pending")}</p>
            <p className="text-3xl font-bold text-yellow-400">
              {submissions.filter(s => s.status === "pending").length}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <p className="text-white/60 text-sm mb-2">{t("stats.approved")}</p>
            <p className="text-3xl font-bold text-green-400">
              {submissions.filter(s => s.status === "approved").length}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <p className="text-white/60 text-sm mb-2">{t("stats.rejected")}</p>
            <p className="text-3xl font-bold text-red-400">
              {submissions.filter(s => s.status === "rejected").length}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <p className="text-white/60 text-sm mb-2">{t("stats.averageScore")}</p>
            <p className="text-3xl font-bold text-[#c9a962]">
              {submissions.length > 0
                ? (submissions.reduce((acc, s) => {
                  const avg = s.scores.length > 0
                    ? s.scores.reduce((sum, score) => sum + score.total, 0) / s.scores.length
                    : 0;
                  return acc + avg;
                }, 0) / submissions.filter(s => s.scores.length > 0).length || 0).toFixed(1)
                : "-"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/apply"
            className="px-6 py-3 bg-[#c9a962] text-black font-medium rounded-lg hover:bg-[#d4b86a] transition-all"
          >
            + {t("actions.newSubmission")}
          </Link>
          <Link
            href="/artist/profile"
            className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all"
          >
            {t("actions.editProfile")}
          </Link>
        </div>

        {/* Submissions */}
        <div>
          <h2 className="font-display text-2xl font-medium text-white mb-6">
            {t("submissions.title")}
          </h2>

          {submissions.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/60 mb-4">{t("submissions.empty")}</p>
              <Link href="/apply" className="text-[#c9a962] hover:underline">
                {t("submissions.submitFirst")}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => {
                const imageUrls = JSON.parse(submission.imageUrls) as string[];
                const avgScore = submission.scores.length > 0
                  ? submission.scores.reduce((sum, s) => sum + s.total, 0) / submission.scores.length
                  : null;

                return (
                  <div
                    key={submission.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Images */}
                      <div className="flex gap-2 overflow-x-auto md:w-48">
                        {imageUrls.slice(0, 3).map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt={`${submission.artworkTitle} ${i + 1}`}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                        ))}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">
                            {submission.artworkTitle || submission.artistName}
                          </h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(submission.status)}`}>
                            {t(`submissions.status.${submission.status}`)}
                          </span>
                        </div>
                        <p className="text-white/40 text-sm mb-3">
                          {t("submissions.submitted")} {formatDate(submission.createdAt)}
                        </p>

                        {avgScore && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[#c9a962] font-medium">{t("submissions.score")}: {avgScore.toFixed(1)}/40</span>
                            <span className="text-white/40 text-sm">({submission.scores.length} {t("submissions.juryReviews")})</span>
                          </div>
                        )}

                        {submission.scores.length > 0 && (
                          <div className="mt-4 space-y-3">
                            <p className="text-white/60 text-sm font-medium">{t("submissions.feedback")}:</p>

                            {/* Score Summary */}
                            <div className="grid grid-cols-4 gap-2 text-center text-sm">
                              <div className="bg-white/5 rounded p-2">
                                <p className="text-white/40 text-xs">{t("submissions.creativity")}</p>
                                <p className="text-[#c9a962] font-medium">
                                  {(submission.scores.reduce((sum, s) => sum + s.creativity, 0) / submission.scores.length).toFixed(1)}
                                </p>
                              </div>
                              <div className="bg-white/5 rounded p-2">
                                <p className="text-white/40 text-xs">{t("submissions.technique")}</p>
                                <p className="text-[#c9a962] font-medium">
                                  {(submission.scores.reduce((sum, s) => sum + s.technique, 0) / submission.scores.length).toFixed(1)}
                                </p>
                              </div>
                              <div className="bg-white/5 rounded p-2">
                                <p className="text-white/40 text-xs">{t("submissions.concept")}</p>
                                <p className="text-[#c9a962] font-medium">
                                  {(submission.scores.reduce((sum, s) => sum + s.concept, 0) / submission.scores.length).toFixed(1)}
                                </p>
                              </div>
                              <div className="bg-white/5 rounded p-2">
                                <p className="text-white/40 text-xs">{t("submissions.presentation")}</p>
                                <p className="text-[#c9a962] font-medium">
                                  {(submission.scores.reduce((sum, s) => sum + s.presentation, 0) / submission.scores.length).toFixed(1)}
                                </p>
                              </div>
                            </div>

                            {/* Individual Reviews */}
                            <div className="space-y-2">
                              {submission.scores.map((score, i) => (
                                <div key={i} className="bg-white/5 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/60 text-xs">{t("submissions.review")} #{i + 1}</span>
                                    <span className="text-[#c9a962] font-medium text-sm">{score.total}/40</span>
                                  </div>
                                  {score.comments && (
                                    <p className="text-white/80 text-sm mb-2">&ldquo;{score.comments}&rdquo;</p>
                                  )}
                                  <div className="flex gap-3 text-xs text-white/40">
                                    <span>{t("submissions.scoreAbbr.creativity")}: {score.creativity}</span>
                                    <span>{t("submissions.scoreAbbr.technique")}: {score.technique}</span>
                                    <span>{t("submissions.scoreAbbr.concept")}: {score.concept}</span>
                                    <span>{t("submissions.scoreAbbr.presentation")}: {score.presentation}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/artist/submissions/${submission.id}/edit`}
                          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all text-sm text-center"
                        >
                          {t("submissions.edit")}
                        </Link>
                        {submission.status === "pending" && (
                          <form action={async () => {
                            "use server";
                            await prisma.submission.delete({ where: { id: submission.id } });
                          }}>
                            <button
                              type="submit"
                              className="w-full px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm"
                            >
                              {t("submissions.delete")}
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
