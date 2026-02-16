"use server";

import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth-actions";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function isAllowedFile(file: { type: string; name: string }): boolean {
  if (ALLOWED_TYPES.includes(file.type)) return true;
  const ext = path.extname(file.name).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

export async function submitArtwork(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    // Check if user is authenticated
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return { error: "You must be signed in to submit artwork" };
    }

    // Verify user exists in database (cookie might be stale after db reset)
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
    });
    if (!user) {
      return { error: "User not found. Please log in again." };
    }

    const artistName = String(formData.get("artistName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const country = String(formData.get("country") ?? "").trim();
    const statement = (formData.get("statement") as string | null)?.trim() || null;
    const artworkTitle = (formData.get("artworkTitle") as string | null)?.trim() || artistName;

    if (!artistName || !email || !country) {
      return { error: "Artist name, email, and country are required" };
    }

    const files = formData.getAll("images");
    const validFiles: { file: File; i: number }[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f instanceof File && f.size > 0) {
        validFiles.push({ file: f, i });
      }
    }

    if (validFiles.length === 0) {
      return { error: "At least one image is required (JPEG, PNG, WebP or GIF, max 10MB each)" };
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const imageUrls: string[] = [];
    const batchId = Date.now();

    for (const { file, i } of validFiles) {
      if (file.size > MAX_FILE_SIZE) {
        return { error: `File ${file.name} exceeds 10MB limit` };
      }
      if (!isAllowedFile(file)) {
        return { error: `File ${file.name} must be JPEG, PNG, WebP, or GIF` };
      }

      const ext = path.extname(file.name) || ".jpg";
      const filename = `${batchId}-${i}${ext}`;
      const filepath = path.join(UPLOAD_DIR, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filepath, buffer);

      imageUrls.push(`/uploads/${filename}`);
    }

    await prisma.submission.create({
      data: {
        artistName,
        email,
        country,
        statement,
        imageUrls: JSON.stringify(imageUrls),
        artworkTitle: artworkTitle || artistName,
        artistId: user.id,
      } as any,
    });

    revalidatePath("/exhibitions");
    return { success: true };
  } catch (error) {
    console.error("submitArtwork error:", error);
    return { error: `Server error: ${error instanceof Error ? error.message : "Unknown error"}` };
  }
}
