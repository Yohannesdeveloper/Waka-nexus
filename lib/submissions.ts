import { prisma } from "./db";

export async function getApprovedSubmissions() {
  const submissions = await prisma.submission.findMany({
    where: { status: "approved" },
    orderBy: { createdAt: "desc" },
  });

  return submissions.map((s) => {
    let imageUrls: string[] = [];
    try {
      imageUrls = JSON.parse(s.imageUrls);
    } catch (e) {
      console.error(`Error parsing imageUrls for submission ${s.id}:`, e);
      imageUrls = [];
    }

    return {
      id: s.id,
      artistName: s.artistName,
      country: s.country,
      artworkTitle: s.artworkTitle,
      imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
    };
  });
}

export async function getSubmissions() {
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return submissions.map((s) => {
    let imageUrls: string[] = [];
    try {
      imageUrls = JSON.parse(s.imageUrls);
    } catch (e) {
      console.error(`Error parsing imageUrls for submission ${s.id}:`, e);
      imageUrls = [];
    }

    return {
      ...s,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
    };
  });
}

// Event functions
export async function getEvents() {
  return prisma.event.findMany({
    orderBy: { startDate: "desc" },
  });
}

export async function getUpcomingEvents() {
  return prisma.event.findMany({
    where: {
      status: { in: ["upcoming", "ongoing"] },
    },
    orderBy: { startDate: "asc" },
  });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
  });
}

// News functions
export async function getNews() {
  return prisma.newsItem.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getPublishedNews() {
  return prisma.newsItem.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getNewsById(id: string) {
  return prisma.newsItem.findUnique({
    where: { id },
  });
}
