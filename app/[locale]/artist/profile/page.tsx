import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-actions";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

async function getArtistProfile(userId: string) {
  return prisma.artistProfile.findUnique({
    where: { userId },
  });
}

async function updateProfile(formData: FormData) {
  "use server";

  const user = await requireAuth();
  if (user.role !== "artist") {
    throw new Error("Unauthorized");
  }

  const bio = formData.get("bio") as string;
  const website = formData.get("website") as string;
  const country = formData.get("country") as string;
  const socialLinks = formData.get("socialLinks") as string;

  await prisma.artistProfile.upsert({
    where: { userId: user.id },
    update: {
      bio: bio || null,
      website: website || null,
      country: country || null,
      socialLinks: socialLinks || null,
    },
    create: {
      userId: user.id,
      bio: bio || null,
      website: website || null,
      country: country || null,
      socialLinks: socialLinks || null,
    },
  });

  revalidatePath("/artist/dashboard");
  revalidatePath("/artist/profile");
}

export default async function ArtistProfilePage() {
  const user = await requireAuth();
  const t = await getTranslations("artist.dashboard.profile");

  if (user.role !== "artist") {
    redirect("/");
  }

  const profile = await getArtistProfile(user.id);

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <a
            href="/artist/dashboard"
            className="text-[#c9a962] hover:underline mb-4 inline-block"
          >
            {t("backToDashboard")}
          </a>
          <h1 className="font-display text-4xl font-light text-white">
            {t("title")}
          </h1>
          <p className="text-white/60 mt-2">
            {t("description")}
          </p>
        </div>

        <form action={updateProfile} className="space-y-6 bg-white/5 border border-white/10 rounded-lg p-8">
          <div>
            <label htmlFor="bio" className="block text-white/80 mb-2">
              {t("bioLabel")}
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={profile?.bio || ""}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#c9a962]"
              placeholder={t("bioPlaceholder")}
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-white/80 mb-2">
              {t("websiteLabel")}
            </label>
            <input
              type="url"
              id="website"
              name="website"
              defaultValue={profile?.website || ""}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#c9a962]"
              placeholder={t("websitePlaceholder")}
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-white/80 mb-2">
              {t("countryLabel")}
            </label>
            <input
              type="text"
              id="country"
              name="country"
              defaultValue={profile?.country || ""}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#c9a962]"
              placeholder={t("countryPlaceholder")}
            />
          </div>

          <div>
            <label htmlFor="socialLinks" className="block text-white/80 mb-2">
              {t("socialLinksLabel")}
            </label>
            <textarea
              id="socialLinks"
              name="socialLinks"
              rows={3}
              defaultValue={profile?.socialLinks || ""}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#c9a962]"
              placeholder={t("socialLinksPlaceholder")}
            />
            <p className="text-white/40 text-sm mt-1">
              {t("socialLinksHint")}
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-[#c9a962] text-black font-medium rounded-lg hover:bg-[#d4b86a] transition-all"
            >
              {t("saveChanges")}
            </button>
            <a
              href="/artist/dashboard"
              className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all"
            >
              {t("cancel")}
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
