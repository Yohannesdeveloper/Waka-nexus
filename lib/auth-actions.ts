"use server";

import { cookies } from "next/headers";
import { createUser, findUserByEmail, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "user_session";

export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
  country?: string;
}) {
  try {
    // Check if user exists
    const existing = await findUserByEmail(data.email);
    if (existing) {
      return { success: false, error: "Email already registered" };
    }

    // Create user
    const user = await createUser(data.email, data.password, data.name, "artist");

    // Create artist profile
    await prisma.artistProfile.create({
      data: {
        userId: user.id,
        country: data.country || null,
      },
    });

    return { success: true, user: { id: user.id, email: user.email, name: user.name } };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Failed to create account" };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    let user = await findUserByEmail(email);

    // Special case for Jury member authentication
    if (email === "jury@wakanexus.com" && password === "waka2024") {
      if (!user) {
        // Create jury user if doesn't exist
        const createdUser = await createUser(email, password, "WAKA Nexus Jury", "jury");

        // Ensure jury profile exists
        await prisma.juryProfile.create({
          data: {
            userId: createdUser.id,
            title: "Official Jury member",
          },
        });

        // Refetch to get the full user object with profiles
        user = await findUserByEmail(email);
      } else if (user.role !== "jury") {
        // Ensure existing user has jury role
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "jury" },
        });

        // Ensure jury profile exists if it didn't
        if (!user.juryProfile) {
          await prisma.juryProfile.create({
            data: {
              userId: user.id,
              title: "Official Jury member",
            },
          });
        }

        user = await findUserByEmail(email);
      }
    } else {
      // Normal authentication flow
      if (!user) {
        return { success: false, error: "Invalid email or password" };
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return { success: false, error: "Invalid email or password" };
      }
    }

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Failed to login" };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (!session?.value) return null;

  try {
    return JSON.parse(session.value);
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(role: string | string[]) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}
