"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SubmissionCard, { type SubmissionData } from "./SubmissionCard";

interface AdminDashboardProps {
  submissions: SubmissionData[];
}

export default function AdminDashboard({ submissions }: AdminDashboardProps) {
  const t = useTranslations("admin.dashboard");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "artist">("newest");

  const filteredSubmissions = submissions
    .filter((s) => filter === "all" || s.status === filter)
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return a.artistName.localeCompare(b.artistName);
    });

  const pendingCount = submissions.filter(s => s.status === "pending").length;
  const approvedCount = submissions.filter(s => s.status === "approved").length;
  const rejectedCount = submissions.filter(s => s.status === "rejected").length;

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">{t("stats.pendingReview")}</p>
              <p className="text-2xl font-bold text-white">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-lg">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">{t("stats.approved")}</p>
              <p className="text-2xl font-bold text-white">{approvedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-lg">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">{t("stats.rejected")}</p>
              <p className="text-2xl font-bold text-white">{rejectedCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-red-400 text-lg">❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${filter === status
                ? "bg-[#c9a962] text-black"
                : "bg-white/10 text-white hover:bg-white/20"
                }`}
            >
              {t(`filters.${status}`)}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {(["newest", "oldest", "artist"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${sortBy === option
                ? "bg-[#c9a962] text-black"
                : "bg-white/10 text-white hover:bg-white/20"
                }`}
            >
              {t(`sort.${option}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Grid */}
      <div className="grid gap-6">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">
              {t("noSubmissions")}
            </p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))
        )}
      </div>
    </div>
  );
}