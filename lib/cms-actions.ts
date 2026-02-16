"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Event Actions
export async function createEvent(data: {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
}) {
  try {
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        imageUrl: data.imageUrl || null,
      },
    });
    revalidatePath("/admin/cms");
    revalidatePath("/events");
    revalidatePath("/competition");
    return { success: true, event };
  } catch (error) {
    console.error("Create event error:", error);
    return { success: false, error: "Failed to create event" };
  }
}

export async function updateEvent(
  id: string,
  data: {
    title?: string;
    description?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    imageUrl?: string;
    status?: string;
  }
) {
  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.location && { location: data.location }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.status && { status: data.status }),
      },
    });
    revalidatePath("/admin/cms");
    revalidatePath("/events");
    return { success: true, event };
  } catch (error) {
    console.error("Update event error:", error);
    return { success: false, error: "Failed to update event" };
  }
}

export async function deleteEvent(id: string) {
  try {
    await prisma.event.delete({
      where: { id },
    });
    revalidatePath("/admin/cms");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    console.error("Delete event error:", error);
    return { success: false, error: "Failed to delete event" };
  }
}

// News Actions
export async function createNews(data: {
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  published?: boolean;
}) {
  try {
    const news = await prisma.newsItem.create({
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        imageUrl: data.imageUrl || null,
        published: data.published || false,
      },
    });
    revalidatePath("/admin/cms");
    revalidatePath("/news");
    return { success: true, news };
  } catch (error) {
    console.error("Create news error:", error);
    return { success: false, error: "Failed to create news" };
  }
}

export async function updateNews(
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    imageUrl?: string;
    published?: boolean;
  }
) {
  try {
    const news = await prisma.newsItem.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.published !== undefined && { published: data.published }),
      },
    });
    revalidatePath("/admin/cms");
    revalidatePath("/news");
    return { success: true, news };
  } catch (error) {
    console.error("Update news error:", error);
    return { success: false, error: "Failed to update news" };
  }
}

export async function deleteNews(id: string) {
  try {
    await prisma.newsItem.delete({
      where: { id },
    });
    revalidatePath("/admin/cms");
    revalidatePath("/news");
    return { success: true };
  } catch (error) {
    console.error("Delete news error:", error);
    return { success: false, error: "Failed to delete news" };
  }
}
