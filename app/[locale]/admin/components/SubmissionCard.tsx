"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export interface SubmissionData {
  id: string;
  artistName: string;
  email: string;
  country: string;
  artworkTitle: string | null;
  statement: string | null;
  imageUrls: string[];
  status: string;
  createdAt: string;
}

interface SubmissionCardProps {
  submission: SubmissionData;
}

export default function SubmissionCard({ submission }: SubmissionCardProps) {
  const router = useRouter();
  const t = useTranslations("admin.submissionCard");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/submissions/${submission.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Submission updated successfully:", result);
        router.refresh();
      } else {
        const errorData = await response.json();
        console.error("Failed to update submission status:", errorData.error || "Unknown error");
        console.error("Error details:", errorData.details || "No additional details");
      }
    } catch (error) {
      console.error("Error updating submission:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteSubmission = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/submissions/${submission.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Submission deleted successfully");
        setShowDeleteConfirm(false);
        router.refresh();
      } else {
        const errorData = await response.json();
        console.error("Failed to delete submission:", errorData.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "approved": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Images */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
          {submission.imageUrls.slice(0, 6).map((imageUrl, index) => (
            <div key={index} className="aspect-square bg-black rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt={`${submission.artistName} - ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
          {submission.imageUrls.length > 6 && (
            <div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center text-white/60 text-sm">
              +{submission.imageUrls.length - 6} {t("moreImages")}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">
                {submission.artworkTitle || submission.artistName}
              </h3>
              <p className="text-white/60 text-sm">{submission.artistName} • {submission.country}</p>
              <p className="text-white/40 text-xs mt-1">Submitted: {formatDate(submission.createdAt)}</p>
            </div>

            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                {submission.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Statement */}
          {submission.statement && (
            <div>
              <h4 className="text-white/60 text-sm mb-2">{t("artistStatement")}</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                {submission.statement}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => updateStatus("approved")}
              disabled={isUpdating || submission.status === "approved"}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${submission.status === "approved"
                ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed"
                : "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                } ${isUpdating ? "opacity-50" : ""}`}
            >
              {submission.status === "approved" ? t("alreadyApproved") : t("approve")}
            </button>

            <button
              onClick={() => updateStatus("rejected")}
              disabled={isUpdating || submission.status === "rejected"}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${submission.status === "rejected"
                ? "bg-red-500/20 text-red-400 border border-red-500/30 cursor-not-allowed"
                : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                } ${isUpdating ? "opacity-50" : ""}`}
            >
              {submission.status === "rejected" ? t("alreadyRejected") : t("reject")}
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all bg-gray-500/10 text-gray-400 border border-gray-500/20 hover:bg-gray-500/20 hover:text-red-400 ${isDeleting ? "opacity-50" : ""}`}
              title="Delete submission"
            >
              🗑️
            </button>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold text-white mb-4">{t("confirmDelete")}</h3>
                <p className="text-white/60 mb-6">
                  {t("deleteWarning", { artistName: submission.artistName })}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 rounded-lg font-medium text-sm bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={deleteSubmission}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 rounded-lg font-medium text-sm bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
                  >
                    {isDeleting ? t("deleting") : t("delete")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-white/60 text-sm">{t("contact")}</p>
            <p className="text-white/80 text-sm">{submission.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}