import { getCurrentUser } from "./auth-service";
import { db } from "./prisma";

export const checkUser = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  try {
    if (process.env.DATABASE_URL) {
      const loggedInUser = await db.user.findFirst({
        where: {
          OR: [
            { clerkUserId: currentUser.clerkUserId || currentUser.id },
            { email: currentUser.email },
          ],
        },
      });

      if (loggedInUser) {
        return loggedInUser;
      }
    }
  } catch (error) {
    // Database connection fallback
  }

  return {
    id: currentUser.id || currentUser.clerkUserId,
    clerkUserId: currentUser.clerkUserId || currentUser.id,
    name: currentUser.name || "User",
    email: currentUser.email,
    imageUrl: currentUser.imageUrl || null,
    role: currentUser.role || (currentUser.email?.includes("admin") ? "ADMIN" : "USER"),
  };
};
