"use server";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth-actions";
import { revalidatePath } from "next/cache";

// Get submissions for jury review (anonymous)
// Only shows submissions that have been approved by admin
export async function getJurySubmissions() {
  const user = await requireRole("jury");

  // Get approved submissions that this jury hasn't scored yet
  const submissions = await prisma.submission.findMany({
    where: {
      status: "approved", // Only approved submissions are visible to jury
      scores: {
        none: {
          juryId: user.id
        }
      }
    },
    select: {
      id: true,
      anonymousId: true,
      artworkTitle: true,
      statement: true,
      imageUrls: true,
      country: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return submissions.map(s => ({
    ...s,
    imageUrls: JSON.parse(s.imageUrls) as string[],
  }));
}

// Get submissions already scored by this jury
export async function getJuryScoredSubmissions() {
  const user = await requireRole("jury");

  const scores = await prisma.score.findMany({
    where: { juryId: user.id },
    include: {
      submission: {
        select: {
          id: true,
          anonymousId: true,
          artworkTitle: true,
          statement: true,
          imageUrls: true,
          country: true,
          status: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return scores.map(s => ({
    ...s,
    submission: {
      ...s.submission,
      imageUrls: JSON.parse(s.submission.imageUrls) as string[],
    }
  }));
}

// Submit a score
export async function submitScore(data: {
  submissionId: string;
  creativity: number;
  technique: number;
  concept: number;
  presentation: number;
  comments?: string;
}) {
  const user = await requireRole("jury");

  // Validate scores are between 1-10
  const criteria = [data.creativity, data.technique, data.concept, data.presentation];
  if (criteria.some(s => s < 1 || s > 10)) {
    return { success: false, error: "All scores must be between 1 and 10" };
  }

  const total = data.creativity + data.technique + data.concept + data.presentation;

  try {
    // Check if already scored
    const existing = await prisma.score.findUnique({
      where: {
        submissionId_juryId: {
          submissionId: data.submissionId,
          juryId: user.id,
        }
      }
    });

    if (existing) {
      // Update existing score
      await prisma.score.update({
        where: { id: existing.id },
        data: {
          creativity: data.creativity,
          technique: data.technique,
          concept: data.concept,
          presentation: data.presentation,
          total,
          comments: data.comments,
        }
      });
    } else {
      // Create new score
      await prisma.score.create({
        data: {
          submissionId: data.submissionId,
          juryId: user.id,
          creativity: data.creativity,
          technique: data.technique,
          concept: data.concept,
          presentation: data.presentation,
          total,
          comments: data.comments,
        }
      });
    }

    revalidatePath("/jury");
    return { success: true };
  } catch (error) {
    console.error("Score submission error:", error);
    return { success: false, error: "Failed to submit score" };
  }
}

// Get scoring statistics for jury member
export async function getJuryStats() {
  const user = await requireRole("jury");

  const [totalScored, totalPending] = await Promise.all([
    prisma.score.count({ where: { juryId: user.id } }),
    prisma.submission.count({
      where: {
        status: "approved", // Only count approved submissions
        scores: {
          none: { juryId: user.id }
        }
      }
    })
  ]);

  return { totalScored, totalPending };
}
