"use server";

import { registerUser, loginUser, clearSessionCookie } from "@/lib/auth-service";
import { revalidatePath } from "next/cache";

export async function loginAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const result = await loginUser({ email, password });
  if (result.success) {
    revalidatePath("/", "layout");
  }
  return result;
}

export async function registerAction(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const result = await registerUser({ name, email, password });
  if (result.success) {
    revalidatePath("/", "layout");
  }
  return result;
}

export async function logoutAction() {
  await clearSessionCookie();
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateProfileAction(formData) {
  const { updateUserProfile } = await import("@/lib/auth-service");
  const name = formData.get("name");
  const phone = formData.get("phone");
  const city = formData.get("city");
  const drivingLicense = formData.get("drivingLicense");

  const result = await updateUserProfile({ name, phone, city, drivingLicense });
  if (result.success) {
    revalidatePath("/", "layout");
    revalidatePath("/profile");
  }
  return result;
}
