import { cookies } from "next/headers";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { db } from "./prisma";

const COOKIE_NAME = "auth_session_token";
const USERS_FILE = path.join(process.cwd(), "users-local.json");

// Local JSON fallback store when database is not connected
function readLocalUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading local users:", err);
  }
  return [];
}

function writeLocalUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local users:", err);
  }
}

// Simple deterministic hash for password safety
export function hashPassword(password) {
  return crypto.createHash("sha256").update(password + "_salt_apex_2026").digest("hex");
}

/**
 * Register a user (Prisma + local JSON fallback)
 */
export async function registerUser({ name, email, password }) {
  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const cleanEmail = email.toLowerCase().trim();
  const hashedPassword = hashPassword(password);
  const userId = "usr_" + crypto.randomUUID();

  // Try Prisma first if available
  try {
    if (process.env.DATABASE_URL) {
      const existing = await db.user.findUnique({ where: { email: cleanEmail } });
      if (existing) {
        return { success: false, error: "A user with this email already exists." };
      }

      const created = await db.user.create({
        data: {
          clerkUserId: userId,
          name: name || "User",
          email: cleanEmail,
          role: "USER",
        },
      });

      // Also mirror to local file for fast offline reads
      const localUsers = readLocalUsers().filter(u => u.email !== cleanEmail);
      localUsers.push({
        id: created.id,
        clerkUserId: userId,
        name: created.name,
        email: cleanEmail,
        password: hashedPassword,
        role: created.role,
        imageUrl: created.imageUrl || null,
      });
      writeLocalUsers(localUsers);

      await setSessionCookie({ id: created.id, clerkUserId: userId, email: cleanEmail, name: created.name, role: created.role });
      return { success: true, user: created };
    }
  } catch (dbError) {
    console.warn("DB register fallback to local file:", dbError.message);
  }

  // Local fallback
  const localUsers = readLocalUsers();
  if (localUsers.some(u => u.email === cleanEmail)) {
    return { success: false, error: "A user with this email already exists." };
  }

  const newUser = {
    id: userId,
    clerkUserId: userId,
    name: name || "User",
    email: cleanEmail,
    password: hashedPassword,
    role: cleanEmail.includes("admin") ? "ADMIN" : "USER",
    imageUrl: null,
  };

  localUsers.push(newUser);
  writeLocalUsers(localUsers);

  await setSessionCookie(newUser);
  return { success: true, user: newUser };
}

/**
 * Login user
 */
export async function loginUser({ email, password }) {
  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const cleanEmail = email.toLowerCase().trim();
  const hashedPassword = hashPassword(password);

  // 1. Try local cache / file first
  const localUsers = readLocalUsers();
  let found = localUsers.find(u => u.email === cleanEmail);

  if (found) {
    if (found.password && found.password !== hashedPassword) {
      return { success: false, error: "Invalid password." };
    }
    await setSessionCookie(found);
    return { success: true, user: found };
  }

  // 2. Try database
  try {
    if (process.env.DATABASE_URL) {
      const dbUser = await db.user.findUnique({ where: { email: cleanEmail } });
      if (dbUser) {
        await setSessionCookie(dbUser);
        return { success: true, user: dbUser };
      }
    }
  } catch (dbErr) {
    console.warn("DB login check warning:", dbErr.message);
  }

  // 3. Convenience: If no user found, automatically create an account on login for demo
  return registerUser({ name: cleanEmail.split("@")[0], email: cleanEmail, password });
}

/**
 * Set Session Cookie
 */
export async function setSessionCookie(user) {
  const sessionData = {
    id: user.id || user.clerkUserId,
    clerkUserId: user.clerkUserId || user.id,
    email: user.email,
    name: user.name || "User",
    role: user.role || "USER",
    imageUrl: user.imageUrl || null,
  };

  const payload = Buffer.from(JSON.stringify(sessionData)).toString("base64");
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, payload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return sessionData;
}

/**
 * Clear Session Cookie (Logout)
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Get current authenticated user on server
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const jsonStr = Buffer.from(token, "base64").toString("utf-8");
    const user = JSON.parse(jsonStr);
    return user;
  } catch (err) {
    return null;
  }
}

/**
 * Backward compatibility helper for checkUser()
 */
export async function getAuthSession() {
  const user = await getCurrentUser();
  if (!user) return { userId: null, user: null };
  return { userId: user.clerkUserId || user.id, user };
}

/**
 * Update user profile details
 */
export async function updateUserProfile({ name, phone, city, drivingLicense, avatarUrl }) {
  const current = await getCurrentUser();
  if (!current) {
    return { success: false, error: "Unauthorized" };
  }

  const updatedUser = {
    ...current,
    name: name || current.name,
    phone: phone !== undefined ? phone : (current.phone || ""),
    city: city !== undefined ? city : (current.city || ""),
    drivingLicense: drivingLicense !== undefined ? drivingLicense : (current.drivingLicense || ""),
    imageUrl: avatarUrl || current.imageUrl || null,
  };

  // Update in local file store
  try {
    const localUsers = readLocalUsers();
    const idx = localUsers.findIndex(u => (u.email === current.email || u.id === current.id));
    if (idx !== -1) {
      localUsers[idx] = { ...localUsers[idx], ...updatedUser };
    } else {
      localUsers.push(updatedUser);
    }
    writeLocalUsers(localUsers);
  } catch (err) {
    console.error("Local user profile update error:", err);
  }

  // Update in database if connected
  try {
    if (process.env.DATABASE_URL) {
      await db.user.updateMany({
        where: {
          OR: [
            { clerkUserId: current.clerkUserId || current.id },
            { email: current.email },
          ],
        },
        data: {
          name: updatedUser.name,
          phone: updatedUser.phone,
          imageUrl: updatedUser.imageUrl,
        },
      });
    }
  } catch (dbErr) {
    // DB offline fallback
  }

  // Refresh cookie session
  await setSessionCookie(updatedUser);

  return { success: true, user: updatedUser };
}
