"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface Partner {
  id: string;
  name: string;
  category: string;
  logoUrl: string | null;
  website?: string;
  order: number;
}

const categories = [
  "Museum Partner",
  "Gallery Partner",
  "Art Fair Partner",
  "Cultural Partner",
  "Exhibition Partner",
  "Sponsor",
];

export default function PartnersCMS() {
  const router = useRouter();
  const t = useTranslations("admin.cms.partners");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: categories[0],
    website: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load partners from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("waka_partners");
    if (saved) {
      setPartners(JSON.parse(saved));
    } else {
      // Start with no partners
      setPartners([]);
      localStorage.setItem("waka_partners", JSON.stringify([]));
    }
    setIsLoading(false);
  }, []);

  const savePartners = (newPartners: Partner[]) => {
    setPartners(newPartners);
    localStorage.setItem("waka_partners", JSON.stringify(newPartners));
    // Dispatch storage event to notify other tabs/pages
    window.dispatchEvent(new StorageEvent("storage", {
      key: "waka_partners",
      newValue: JSON.stringify(newPartners),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let logoUrl = editingPartner?.logoUrl || null;

      if (selectedFile) {
        logoUrl = await uploadImage(selectedFile);
      }

      if (editingPartner) {
        // Update existing
        const updated = partners.map((p) =>
          p.id === editingPartner.id
            ? { ...p, ...formData, logoUrl }
            : p
        );
        savePartners(updated);
        setEditingPartner(null);
      } else {
        // Create new
        const newPartner: Partner = {
          id: Date.now().toString(),
          ...formData,
          logoUrl,
          order: partners.length + 1,
        };
        savePartners([...partners, newPartner]);
      }

      // Reset form
      setFormData({ name: "", category: categories[0], website: "" });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error saving partner:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      category: partner.category,
      website: partner.website || "",
    });
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (confirm(t("list.deleteConfirm"))) {
      const filtered = partners.filter((p) => p.id !== id);
      savePartners(filtered);
    }
  };

  const handleCancel = () => {
    setEditingPartner(null);
    setFormData({ name: "", category: categories[0], website: "" });
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const movePartner = (id: string, direction: "up" | "down") => {
    const index = partners.findIndex((p) => p.id === id);
    if (index === -1) return;

    const newPartners = [...partners];
    if (direction === "up" && index > 0) {
      [newPartners[index], newPartners[index - 1]] = [
        newPartners[index - 1],
        newPartners[index],
      ];
    } else if (direction === "down" && index < newPartners.length - 1) {
      [newPartners[index], newPartners[index + 1]] = [
        newPartners[index + 1],
        newPartners[index],
      ];
    }

    // Update order numbers
    const reordered = newPartners.map((p, i) => ({ ...p, order: i + 1 }));
    savePartners(reordered);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pt-28 pb-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/60">{t("loading")}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-medium tracking-[0.4em] uppercase text-[#c9a962] mb-4">
              {t("subtitle")}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-4">
              {t("title")}
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/partners"
              target="_blank"
              className="px-4 py-2 rounded-lg font-medium text-sm bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              {t("viewPage")}
            </Link>
            <Link
              href="/admin/cms"
              className="px-4 py-2 rounded-lg font-medium text-sm bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              {t("backToCms")}
            </Link>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-lg p-6 mb-12"
        >
          <h2 className="text-xl font-medium text-white mb-6">
            {editingPartner ? t("form.editTitle") : t("form.addTitle")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  {t("form.nameLabel")}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none"
                  placeholder={t("form.namePlaceholder")}
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">
                  {t("form.categoryLabel")}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-black">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-2">
                {t("form.websiteLabel")}
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c9a962]/50 outline-none"
                placeholder={t("form.websitePlaceholder")}
              />
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-2">
                {t("form.logoLabel")} {editingPartner?.logoUrl && t("form.logoKeepHint")}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#c9a962] file:text-black file:font-medium hover:file:bg-[#d4b86a]"
              />
              {selectedFile && (
                <p className="text-[#c9a962] text-sm mt-2">
                  {t("form.selected")}: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Preview */}
            {(selectedFile || editingPartner?.logoUrl) && (
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/60 text-sm mb-3">{t("form.preview")}:</p>
                <div className="w-32 h-20 bg-white/10 rounded flex items-center justify-center overflow-hidden">
                  {selectedFile ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : editingPartner?.logoUrl ? (
                    <img
                      src={editingPartner.logoUrl}
                      alt={editingPartner.name}
                      className="w-full h-full object-contain"
                    />
                  ) : null}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {editingPartner && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  {t("form.cancel")}
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[#c9a962] text-black rounded-lg hover:bg-[#d4b86a] transition-all disabled:opacity-50 font-medium"
              >
                {isSubmitting
                  ? t("form.saving")
                  : editingPartner
                    ? t("form.update")
                    : t("form.add")}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Partners List */}
        <div>
          <h2 className="text-xl font-medium text-white mb-6">
            {t("list.title")} ({partners.length})
          </h2>

          {partners.length === 0 ? (
            <p className="text-white/60 text-center py-12">
              {t("list.noPartners")}
            </p>
          ) : (
            <div className="space-y-4">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-4"
                >
                  {/* Logo */}
                  <div className="w-20 h-14 bg-white/10 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-white/30 text-xs">{t("list.noLogo")}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">
                      {partner.name}
                    </h3>
                    <p className="text-[#c9a962] text-sm">{partner.category}</p>
                  </div>

                  {/* Order Controls */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => movePartner(partner.id, "up")}
                      disabled={index === 0}
                      className="text-white/40 hover:text-white disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => movePartner(partner.id, "down")}
                      disabled={index === partners.length - 1}
                      className="text-white/40 hover:text-white disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(partner)}
                      className="px-3 py-1.5 bg-white/10 text-white rounded text-sm hover:bg-white/20 transition-all"
                    >
                      {t("list.edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(partner.id)}
                      className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded text-sm hover:bg-red-500/20 transition-all"
                    >
                      {t("list.delete")}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
