import { redirect, notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth-actions";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function getSubmission(id: string, userId: string) {
  return prisma.submission.findFirst({
    where: {
      id,
      artistId: userId,
    },
  });
}

async function updateSubmission(formData: FormData) {
  "use server";

  const user = await requireAuth();
  if (user.role !== "artist") {
    throw new Error("Unauthorized");
  }

  const submissionId = formData.get("submissionId") as string;
  const artworkTitle = formData.get("artworkTitle") as string;
  const statement = formData.get("statement") as string;
  const artistName = formData.get("artistName") as string;
  const country = formData.get("country") as string;

  // Verify the submission belongs to this artist
  const submission = await prisma.submission.findFirst({
    where: {
      id: submissionId,
      artistId: user.id,
    },
  });

  if (!submission) {
    throw new Error("Submission not found");
  }

  // Only allow editing if status is pending
  if (submission.status !== "pending") {
    throw new Error("Can only edit pending submissions");
  }

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      artworkTitle: artworkTitle || artistName,
      statement: statement || null,
      artistName,
      country,
    },
  });

  revalidatePath("/artist/dashboard");
  redirect("/artist/dashboard");
}

interface EditSubmissionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSubmissionPage({ params }: EditSubmissionPageProps) {
  const user = await requireAuth();

  if (user.role !== "artist") {
    redirect("/");
  }

  const { id } = await params;
  const submission = await getSubmission(id, user.id);

  if (!submission) {
    notFound();
  }

  // Only allow editing pending submissions
  if (submission.status !== "pending") {
    redirect("/artist/dashboard");
  }

  const imageUrls = JSON.parse(submission.imageUrls) as string[];

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <a
            href="/artist/dashboard"
            className="text-[#c9a962] hover:underline mb-4 inline-block"
          >
            ← Back to Dashboard
          </a>
          <h1 className="font-display text-4xl font-light text-white">
            Edit Submission
          </h1>
          <p className="text-white/60 mt-2">
            Update your artwork submission details.
          </p>
        </div>

        <form action={updateSubmission} className="space-y-6 bg-white/5 border border-white/10 rounded-lg p-8">
          <input type="hidden" name="submissionId" value={submission.id} />

          <div>
            <label htmlFor="artworkTitle" className="block text-white/80 mb-2">
              Artwork Title
            </label>
            <input
              type="text"
              id="artworkTitle"
              name="artworkTitle"
              defaultValue={submission.artworkTitle || ""}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#c9a962]"
              placeholder="Enter artwork title"
            />
          </div>

          <div>
            <label htmlFor="artistName" className="block text-white/80 mb-2">
              Artist Name *
            </label>
            <input
              type="text"
              id="artistName"
              name="artistName"
              required
              defaultValue={submission.artistName}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#c9a962]"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-white/80 mb-2">
              Country *
            </label>
            <input
              type="text"
              id="country"
              name="country"
              required
              defaultValue={submission.country}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#c9a962]"
              placeholder="Your country"
            />
          </div>

          <div>
            <label htmlFor="statement" className="block text-white/80 mb-2">
              Artist Statement
            </label>
            <textarea
              id="statement"
              name="statement"
              rows={4}
              defaultValue={submission.statement || ""}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#c9a962]"
              placeholder="Describe your artwork..."
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2">
              Current Images
            </label>
            <div className="flex gap-4 flex-wrap">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative">
                  <img
                    src={url}
                    alt={`Artwork ${i + 1}`}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
            <p className="text-white/40 text-sm mt-2">
              Images cannot be changed after submission. Create a new submission if you need different images.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-[#c9a962] text-black font-medium rounded-lg hover:bg-[#d4b86a] transition-all"
            >
              Save Changes
            </button>
            <a
              href="/artist/dashboard"
              className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
