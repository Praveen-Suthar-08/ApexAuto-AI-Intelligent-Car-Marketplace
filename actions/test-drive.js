"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth-server";
import { db } from "@/lib/prisma";
import { serializeCarData } from "@/lib/helpers";
import fs from "fs";
import path from "path";

const BOOKINGS_FILE = path.join(process.cwd(), "bookings-local.json");

function readLocalBookings() {
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      return JSON.parse(fs.readFileSync(BOOKINGS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Error reading local bookings:", err);
  }
  return [];
}

function writeLocalBookings(bookings) {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local bookings:", err);
  }
}

/**
 * Books a test drive for a car
 */
export async function bookTestDrive({
  carId,
  bookingDate,
  startTime,
  endTime,
  notes,
}) {
  try {
    const { userId, user } = await auth();
    if (!userId) throw new Error("You must be logged in to book a test drive");

    const bookingId = "bk_" + Date.now();

    // 1. Try Prisma if connected
    try {
      if (process.env.DATABASE_URL) {
        const dbUser = await db.user.findFirst({
          where: {
            OR: [{ clerkUserId: userId }, { id: userId }],
          },
        });

        if (dbUser) {
          const booking = await db.testDriveBooking.create({
            data: {
              carId: String(carId),
              userId: dbUser.id,
              bookingDate: new Date(bookingDate),
              startTime,
              endTime,
              notes,
              status: "PENDING",
            },
          });

          revalidatePath(`/cars/${carId}`);
          revalidatePath("/reservations");
          return { success: true, data: booking };
        }
      }
    } catch (dbErr) {
      console.warn("DB offline for booking, writing to local store:", dbErr.message);
    }

    // 2. Local fallback storage
    const { featuredCars } = await import("@/lib/data");
    const car = featuredCars.find((c) => c.id == carId) || featuredCars[0];

    const localBookings = readLocalBookings();
    const newBooking = {
      id: bookingId,
      carId: String(carId),
      userId,
      car,
      bookingDate: new Date(bookingDate).toISOString(),
      startTime,
      endTime,
      notes: notes || "",
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localBookings.unshift(newBooking);
    writeLocalBookings(localBookings);

    revalidatePath(`/cars/${carId}`);
    revalidatePath("/reservations");

    return {
      success: true,
      data: newBooking,
    };
  } catch (error) {
    console.error("Error booking test drive:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get user's test drive bookings - reservations page
 */
export async function getUserTestDrives() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // 1. Try Prisma database if accessible
    try {
      if (process.env.DATABASE_URL) {
        const user = await db.user.findFirst({
          where: {
            OR: [{ clerkUserId: userId }, { id: userId }],
          },
        });

        if (user) {
          const bookings = await db.testDriveBooking.findMany({
            where: { userId: user.id },
            include: { car: true },
            orderBy: { bookingDate: "desc" },
          });

          const formatted = bookings.map((booking) => ({
            id: booking.id,
            carId: booking.carId,
            car: serializeCarData(booking.car),
            bookingDate: booking.bookingDate.toISOString(),
            startTime: booking.startTime,
            endTime: booking.endTime,
            status: booking.status,
            notes: booking.notes,
            createdAt: booking.createdAt.toISOString(),
            updatedAt: booking.updatedAt.toISOString(),
          }));

          return { success: true, data: formatted };
        }
      }
    } catch (dbErr) {
      // Database not reachable, proceed to local storage
    }

    // 2. Read from local bookings store
    const localBookings = readLocalBookings().filter(
      (b) => b.userId === userId || !b.userId
    );

    return {
      success: true,
      data: localBookings,
    };
  } catch (error) {
    return {
      success: true,
      data: [],
    };
  }
}

/**
 * Cancel a test drive booking
 */
export async function cancelTestDrive(bookingId) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    try {
      if (process.env.DATABASE_URL) {
        await db.testDriveBooking.update({
          where: { id: bookingId },
          data: { status: "CANCELLED" },
        });
      }
    } catch (dbErr) {
      // Local fallback
    }

    const localBookings = readLocalBookings().map((b) =>
      b.id === bookingId ? { ...b, status: "CANCELLED" } : b
    );
    writeLocalBookings(localBookings);

    revalidatePath("/reservations");
    return {
      success: true,
      message: "Test drive cancelled successfully",
    };
  } catch (error) {
    console.error("Error cancelling test drive:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
