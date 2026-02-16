import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "executive-summary.html");
    const html = await readFile(filePath, "utf-8");

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": 'attachment; filename="WAKA-Executive-Summary.html"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Executive summary read error:", err);
    return new NextResponse("Executive summary not found.", { status: 404 });
  }
}
