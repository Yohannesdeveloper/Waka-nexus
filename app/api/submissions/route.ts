import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function isAllowedFile(file: File): boolean {
  if (ALLOWED_TYPES.includes(file.type)) return true;
  const ext = path.extname(file.name).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
    });

    const parsed = submissions.map((s) => ({
      ...s,
      imageUrls: JSON.parse(s.imageUrls) as string[],
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("GET /api/submissions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const artistName = String(formData.get("artistName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const country = String(formData.get("country") ?? "").trim();
    const statement = (formData.get("statement") as string | null)?.trim() || null;
    const artworkTitle = (formData.get("artworkTitle") as string | null)?.trim() || artistName;

    if (!artistName || !email || !country) {
      return NextResponse.json(
        { error: "Artist name, email, and country are required" },
        { status: 400 }
      );
    }

    const files = formData.getAll("images");
    const validFiles = files.filter((f): f is File => f instanceof File && f.size > 0);
    if (validFiles.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required (JPEG, PNG, WebP or GIF, max 10MB each)" },
        { status: 400 }
      );
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const imageUrls: string[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      if (!file || file.size === 0) continue;

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 10MB limit` },
          { status: 400 }
        );
      }

      if (!isAllowedFile(file)) {
        return NextResponse.json(
          { error: `File ${file.name} must be JPEG, PNG, WebP, or GIF` },
          { status: 400 }
        );
      }

      const ext = path.extname(file.name) || ".jpg";
      const filename = `${Date.now()}-${i}${ext}`;
      const filepath = path.join(UPLOAD_DIR, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filepath, buffer);

      imageUrls.push(`/uploads/${filename}`);
    }

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { error: "No valid images were uploaded" },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        artistName: artistName.trim(),
        email: email.trim(),
        country: country.trim(),
        statement: statement?.trim() || null,
        imageUrls: JSON.stringify(imageUrls),
        artworkTitle: artworkTitle?.trim() || artistName.trim(),
      },
    });

    const result = {
      ...submission,
      imageUrls: JSON.parse(submission.imageUrls),
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/submissions error:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}
