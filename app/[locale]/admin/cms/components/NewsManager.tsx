"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNews, updateNews, deleteNews } from "@/lib/cms-actions";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  imageUrl: string | null;
  published: boolean;
  createdAt: Date;
}

interface NewsManagerProps {
  initialNews: NewsItem[];
}

export default function NewsManager({ initialNews }: NewsManagerProps) {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      excerpt: formData.get("excerpt") as string,
      imageUrl: formData.get("imageUrl") as string,
      published: formData.get("published") === "on",
    };

    try {
      if (editingNews) {
        const result = await updateNews(editingNews.id, data);
        if (result.success) {
          setShowForm(false);
          setEditingNews(null);
          router.refresh();
        }
      } else {
        const result = await createNews(data);
        if (result.success) {
          setShowForm(false);
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Error saving news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news item?")) return;

    setIsLoading(true);
    try {
      const result = await deleteNews(id);
      if (result.success) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublish = async (item: NewsItem) => {
    try {
      const result = await updateNews(item.id, { published: !item.published });
      if (result.success) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Add News Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditingNews(null);
            setShowForm(true);
          }}
          className="px-6 py-3 bg-[#c9a962] text-black font-medium rounded-lg hover:bg-[#d4b86a] transition-all"
        >
          + Add News
        </button>
      </div>

      {/* News Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {editingNews ? "Edit News" : "Create News"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Title</label>
                <input
                  name="title"
                  defaultValue={editingNews?.title}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Excerpt (Optional)</label>
                <input
                  name="excerpt"
                  defaultValue={editingNews?.excerpt || ""}
                  placeholder="Brief summary of the news..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Content</label>
                <textarea
                  name="content"
                  defaultValue={editingNews?.content}
                  required
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Image URL (Optional)</label>
                <input
                  name="imageUrl"
                  defaultValue={editingNews?.imageUrl || ""}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="published"
                  id="published"
                  defaultChecked={editingNews?.published}
                  className="w-5 h-5 accent-[#c9a962]"
                />
                <label htmlFor="published" className="text-white/70">Publish immediately</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingNews(null);
                  }}
                  className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-[#c9a962] text-black rounded-lg hover:bg-[#d4b86a] transition-all disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : editingNews ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* News List */}
      <div className="grid gap-4">
        {news.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white/60">No news yet. Create your first news item!</p>
          </div>
        ) : (
          news.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${item.published
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                        }`}
                    >
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  {item.excerpt && (
                    <p className="text-white/60 text-sm mb-2 line-clamp-2">{item.excerpt}</p>
                  )}
                  <p className="text-white/40 text-sm">{formatDate(item.createdAt)}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => togglePublish(item)}
                    className={`px-4 py-2 rounded-lg transition-all text-sm ${item.published
                        ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                        : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                      }`}
                  >
                    {item.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingNews(item);
                      setShowForm(true);
                    }}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm"
                  >
                    Delete
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
