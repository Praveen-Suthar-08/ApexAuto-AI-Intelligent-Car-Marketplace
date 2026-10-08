"use server";

import { serializeCarData } from "@/lib/helpers";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";

export async function getAdmin() {
  const { userId, user: sessionUser } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Check database first if connected
  try {
    if (process.env.DATABASE_URL) {
      const user = await db.user.findFirst({
        where: { OR: [{ clerkUserId: userId }, { id: userId }] },
      });
      if (user && user.role === "ADMIN") {
        return { authorized: true, user };
      }
    }
  } catch (err) {
    // Database offline fallback
  }

  // Session fallback
  if (sessionUser && sessionUser.role === "ADMIN") {
    return { authorized: true, user: sessionUser };
  }

  return { authorized: false, reason: "not-admin" };
}

/**
 * Get all test drives for admin with filters
 */
export async function getAdminTestDrives({ search = "", status = "" }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify admin status
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized access");
    }

    // Build where conditions
    let where = {};

    // Add status filter
    if (status) {
      where.status = status;
    }

    // Add search filter
    if (search) {
      where.OR = [
        {
          car: {
            OR: [
              { make: { contains: search, mode: "insensitive" } },
              { model: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    // Get bookings
    const bookings = await db.testDriveBooking.findMany({
      where,
      include: {
        car: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
            phone: true,
          },
        },
      },
      orderBy: [{ bookingDate: "desc" }, { startTime: "asc" }],
    });

    // Format the bookings
    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      carId: booking.carId,
      car: serializeCarData(booking.car),
      userId: booking.userId,
      user: booking.user,
      bookingDate: booking.bookingDate.toISOString(),
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      notes: booking.notes,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));

    return {
      success: true,
      data: formattedBookings,
    };
  } catch (error) {
    console.error("Error fetching test drives:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Update test drive status
 */
export async function updateTestDriveStatus(bookingId, newStatus) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify admin status
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized access");
    }

    // Get the booking
    const booking = await db.testDriveBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Validate status
    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "COMPLETED",
      "CANCELLED",
      "NO_SHOW",
    ];
    if (!validStatuses.includes(newStatus)) {
      return {
        success: false,
        error: "Invalid status",
      };
    }

    // Update status
    await db.testDriveBooking.update({
      where: { id: bookingId },
      data: { status: newStatus },
    });

    // Revalidate paths
    revalidatePath("/admin/test-drives");
    revalidatePath("/reservations");

    return {
      success: true,
      message: "Test drive status updated successfully",
    };
  } catch (error) {
    throw new Error("Error updating test drive status:" + error.message);
  }
}

export async function getDashboardData() {
  try {
    const { userId, user: sessionUser } = await auth();

    // 1. Try Prisma if connected and user is admin
    try {
      if (userId && process.env.DATABASE_URL) {
        const user = await db.user.findFirst({
          where: { OR: [{ clerkUserId: userId }, { id: userId }] },
        });

        if (user && user.role === "ADMIN") {
          const [cars, testDrives] = await Promise.all([
            db.car.findMany({ select: { id: true, status: true, featured: true } }),
            db.testDriveBooking.findMany({ select: { id: true, status: true, carId: true } }),
          ]);

          const totalCars = cars.length;
          const availableCars = cars.filter((car) => car.status === "AVAILABLE").length;
          const soldCars = cars.filter((car) => car.status === "SOLD").length;
          const unavailableCars = cars.filter((car) => car.status === "UNAVAILABLE").length;
          const featuredCars = cars.filter((car) => car.featured === true).length;

          const totalTestDrives = testDrives.length;
          const pendingTestDrives = testDrives.filter((td) => td.status === "PENDING").length;
          const confirmedTestDrives = testDrives.filter((td) => td.status === "CONFIRMED").length;
          const completedTestDrives = testDrives.filter((td) => td.status === "COMPLETED").length;
          const cancelledTestDrives = testDrives.filter((td) => td.status === "CANCELLED").length;
          const noShowTestDrives = testDrives.filter((td) => td.status === "NO_SHOW").length;

          const completedTestDriveCarIds = testDrives
            .filter((td) => td.status === "COMPLETED")
            .map((td) => td.carId);

          const soldCarsAfterTestDrive = cars.filter(
            (car) => car.status === "SOLD" && completedTestDriveCarIds.includes(car.id)
          ).length;

          const conversionRate =
            completedTestDrives > 0
              ? (soldCarsAfterTestDrive / completedTestDrives) * 100
              : 0;

          return {
            success: true,
            data: {
              cars: {
                total: totalCars,
                available: availableCars,
                sold: soldCars,
                unavailable: unavailableCars,
                featured: featuredCars,
              },
              testDrives: {
                total: totalTestDrives,
                pending: pendingTestDrives,
                confirmed: confirmedTestDrives,
                completed: completedTestDrives,
                cancelled: cancelledTestDrives,
                noShow: noShowTestDrives,
                conversionRate: parseFloat(conversionRate.toFixed(2)),
              },
            },
          };
        }
      }
    } catch (dbErr) {
      console.warn("DB offline for getDashboardData, using local fleet stats:", dbErr.message);
    }

    // 2. Standalone / Demo Admin Fallback
    const { featuredCars: demoCars } = await import("@/lib/data");
    return {
      success: true,
      data: {
        cars: {
          total: demoCars.length,
          available: demoCars.length,
          sold: 14,
          unavailable: 0,
          featured: demoCars.filter((c) => c.featured).length,
        },
        testDrives: {
          total: 8,
          pending: 2,
          confirmed: 4,
          completed: 2,
          cancelled: 0,
          noShow: 0,
          conversionRate: 66.7,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}
