"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createEvent, updateEvent, deleteEvent, createNews, updateNews, deleteNews } from "@/lib/cms-actions";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  imageUrl: string | null;
  status: string;
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  imageUrl: string | null;
  published: boolean;
  createdAt: Date;
}

interface ContentManagerProps {
  events: Event[];
  news: NewsItem[];
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function ContentManager({ events, news }: ContentManagerProps) {
  const router = useRouter();
  const t = useTranslations("admin.cms.contentManager");
  const tt = useTranslations("admin.cms.tabs");
  const [activeType, setActiveType] = useState<"events" | "news">("events");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<(Event | NewsItem) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert(t("imageErrorSize"));
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert(t("imageErrorType"));
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    console.log("Uploading image:", file.name, file.size);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Upload response:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Upload success:", data.url);
        return data.url;
      } else {
        const error = await response.json();
        console.error("Upload failed:", error);
      }
      return null;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const file = selectedFile;
    console.log("File selected:", file?.name || "none");
    let imageUrl = editingItem?.imageUrl || "";

    // Upload image if selected
    if (file) {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    try {
      if (activeType === "events") {
        const data = {
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          location: formData.get("location") as string,
          startDate: formData.get("startDate") as string,
          endDate: formData.get("endDate") as string,
          imageUrl: imageUrl || undefined,
        };

        if (editingItem && "location" in editingItem) {
          const result = await updateEvent(editingItem.id, data);
          if (result.success) {
            setShowForm(false);
            setEditingItem(null);
            setPreviewImage(null);
            setSelectedFile(null);
            router.refresh();
          }
        } else {
          const result = await createEvent(data);
          if (result.success) {
            setShowForm(false);
            setPreviewImage(null);
            setSelectedFile(null);
            router.refresh();
          }
        }
      } else {
        const data = {
          title: formData.get("title") as string,
          content: formData.get("content") as string,
          excerpt: formData.get("excerpt") as string,
          imageUrl: imageUrl || undefined,
          published: formData.get("published") === "on",
        };

        if (editingItem && "content" in editingItem) {
          const result = await updateNews(editingItem.id, data);
          if (result.success) {
            setShowForm(false);
            setEditingItem(null);
            setPreviewImage(null);
            setSelectedFile(null);
            router.refresh();
          }
        } else {
          const result = await createNews(data);
          if (result.success) {
            setShowForm(false);
            setPreviewImage(null);
            setSelectedFile(null);
            router.refresh();
          }
        }
      }
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (item: Event | NewsItem) => {
    const isEvent = "location" in item;
    const confirmMessage = isEvent ? t("deleteConfirmEvent") : t("deleteConfirmNews");
    if (!confirm(confirmMessage)) return;

    setIsLoading(true);
    try {
      const result = "location" in item
        ? await deleteEvent(item.id)
        : await deleteNews(item.id);

      if (result.success) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: Event | NewsItem) => {
    setEditingItem(item);
    setPreviewImage(item.imageUrl);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setPreviewImage(null);
    setShowForm(true);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const currentItems = activeType === "events" ? events : news;
  const isEvent = activeType === "events";

  return (
    <div className="space-y-6">
      {/* Type Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setActiveType("events")}
            className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${activeType === "events"
                ? "bg-[#c9a962] text-black"
                : "text-white/70 hover:text-white"
              }`}
          >
            {tt("eventsCount", { count: events.length })}
          </button>
          <button
            onClick={() => setActiveType("news")}
            className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${activeType === "news"
                ? "bg-[#c9a962] text-black"
                : "text-white/70 hover:text-white"
              }`}
          >
            {tt("newsCount", { count: news.length })}
          </button>
        </div>

        <button
          onClick={handleAddNew}
          className="px-6 py-2 bg-[#c9a962] text-black font-medium rounded-lg hover:bg-[#d4b86a] transition-all text-sm"
        >
          {isEvent ? t("addEvent") : t("addNews")}
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {editingItem
                ? (isEvent ? t("editEvent") : t("editNews"))
                : (isEvent ? t("createEvent") : t("createNews"))}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  {t("imageLabel")} {isEvent ? "" : t("imageOptional")}
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-[#c9a962]/40 transition-colors">
                  {(previewImage || editingItem?.imageUrl) ? (
                    <div className="relative">
                      <img
                        src={previewImage || editingItem?.imageUrl || ""}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="mt-2 text-red-400 text-sm hover:text-red-300"
                      >
                        {t("removeImage")}
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer text-white/50 hover:text-[#c9a962] transition-colors"
                      >
                        <div className="text-4xl mb-2">📷</div>
                        <p className="text-sm">{t("uploadImage")}</p>
                        <p className="text-xs text-white/30 mt-1">{t("fileTypes")}</p>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t("titleLabel")}</label>
                <input
                  name="title"
                  defaultValue={editingItem?.title}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none"
                />
              </div>

              {isEvent ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">{t("locationLabel")}</label>
                    <input
                      name="location"
                      defaultValue={editingItem && "location" in editingItem ? editingItem.location : ""}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">{t("startDateLabel")}</label>
                      <input
                        name="startDate"
                        type="datetime-local"
                        defaultValue={editingItem && "startDate" in editingItem
                          ? new Date(editingItem.startDate).toISOString().slice(0, 16)
                          : ""}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">{t("endDateLabel")}</label>
                      <input
                        name="endDate"
                        type="datetime-local"
                        defaultValue={editingItem && "endDate" in editingItem && editingItem.endDate
                          ? new Date(editingItem.endDate).toISOString().slice(0, 16)
                          : ""}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">{t("excerptLabel")}</label>
                  <input
                    name="excerpt"
                    defaultValue={editingItem && "excerpt" in editingItem ? editingItem.excerpt || "" : ""}
                    placeholder={t("excerptPlaceholder")}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  {isEvent ? t("descriptionLabel") : t("contentLabel")}
                </label>
                <textarea
                  name={isEvent ? "description" : "content"}
                  defaultValue={editingItem
                    ? ("description" in editingItem ? editingItem.description : editingItem.content)
                    : ""}
                  required
                  rows={isEvent ? 4 : 6}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none resize-none"
                />
              </div>

              {!isEvent && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="published"
                    id="published"
                    defaultChecked={editingItem && "published" in editingItem ? editingItem.published : false}
                    className="w-5 h-5 accent-[#c9a962]"
                  />
                  <label htmlFor="published" className="text-white/70">{t("publishImmediately")}</label>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                    setPreviewImage(null);
                    setSelectedFile(null);
                  }}
                  className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-[#c9a962] text-black rounded-lg hover:bg-[#d4b86a] transition-all disabled:opacity-50"
                >
                  {isLoading ? t("saving") : editingItem ? t("update") : t("create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="grid gap-4">
        {currentItems.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white/60">{isEvent ? t("noEvents") : t("noNews")}</p>
          </div>
        ) : (
          currentItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Image */}
                {item.imageUrl && (
                  <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    {"status" in item ? (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${item.status === "upcoming"
                            ? "bg-blue-500/20 text-blue-400"
                            : item.status === "ongoing"
                              ? "bg-green-500/20 text-green-400"
                              : item.status === "past"
                                ? "bg-gray-500/20 text-gray-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                      >
                        {item.status}
                      </span>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${item.published
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                          }`}
                      >
                        {item.published ? t("published") : t("draft")}
                      </span>
                    )}
                  </div>

                  {"location" in item ? (
                    <>
                      <p className="text-white/60 text-sm mb-1">{item.location}</p>
                      <p className="text-white/40 text-sm">
                        {formatDate(item.startDate)}
                        {item.endDate && ` - ${formatDate(item.endDate)}`}
                      </p>
                    </>
                  ) : (
                    <>
                      {item.excerpt && (
                        <p className="text-white/60 text-sm mb-2 line-clamp-2">{item.excerpt}</p>
                      )}
                      <p className="text-white/40 text-sm">{formatDate(item.createdAt)}</p>
                    </>
                  )}
                </div>

                <div className="flex gap-2 items-start">
                  {!isEvent && "published" in item && (
                    <button
                      onClick={async () => {
                        const result = await updateNews(item.id, { published: !item.published });
                        if (result.success) router.refresh();
                      }}
                      className={`px-3 py-2 rounded-lg transition-all text-sm ${item.published
                          ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                          : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        }`}
                    >
                      {item.published ? t("unpublish") : t("publish")}
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all text-sm"
                  >
                    {t("edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm"
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
