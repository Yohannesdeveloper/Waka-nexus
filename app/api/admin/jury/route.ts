import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { cookies } from "next/headers";

// Verify admin session
async function verifyAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  
  if (!session) {
    return false;
  }

  try {
    const data = JSON.parse(session);
    return data.role === "admin";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  // Verify admin access
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, password, title } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create jury user with profile
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "jury",
        juryProfile: {
          create: {
            title: title || null,
            bio: null,
            avatarUrl: null,
            active: true,
          },
        },
      },
      include: {
        juryProfile: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Create jury member error:", error);
    return NextResponse.json(
      { error: "Failed to create jury member" },
      { status: 500 }
    );
  }
}
