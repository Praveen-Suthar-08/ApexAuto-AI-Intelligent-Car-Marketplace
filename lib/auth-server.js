import { getCurrentUser } from "./auth-service";

/**
 * Drop-in standard replacement for `@clerk/nextjs/server` auth()
 */
export async function auth() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      userId: null,
      user: null,
      redirectToSignIn: () => {
        return {
          headers: {
            Location: "/sign-in",
          },
          status: 302,
        };
      },
    };
  }

  return {
    userId: user.clerkUserId || user.id,
    user,
    redirectToSignIn: () => null,
  };
}

export async function currentUser() {
  return getCurrentUser();
}
