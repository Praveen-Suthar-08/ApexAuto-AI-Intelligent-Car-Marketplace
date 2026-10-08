"use server";

import { serializeCarData } from "@/lib/helpers";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import {
  toggleSavedCarLocal,
  getSavedCarsByUser,
} from "@/lib/saved-cars-store";

/**
 * Get simplified filters for the car marketplace
 */
export async function getCarFilters() {
  try {
    if (!process.env.DATABASE_URL) {
      return getDemoFilters();
    }

    // Get unique makes
    const makes = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { make: true },
      distinct: ["make"],
      orderBy: { make: "asc" },
    });

    // Get unique body types
    const bodyTypes = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { bodyType: true },
      distinct: ["bodyType"],
      orderBy: { bodyType: "asc" },
    });

    // Get unique fuel types
    const fuelTypes = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { fuelType: true },
      distinct: ["fuelType"],
      orderBy: { fuelType: "asc" },
    });

    // Get unique transmissions
    const transmissions = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { transmission: true },
      distinct: ["transmission"],
      orderBy: { transmission: "asc" },
    });

    // Get min and max prices using Prisma aggregations
    const priceAggregations = await db.car.aggregate({
      where: { status: "AVAILABLE" },
      _min: { price: true },
      _max: { price: true },
    });

    return {
      success: true,
      data: {
        makes: makes.map((item) => item.make),
        bodyTypes: bodyTypes.map((item) => item.bodyType),
        fuelTypes: fuelTypes.map((item) => item.fuelType),
        transmissions: transmissions.map((item) => item.transmission),
        priceRange: {
          min: priceAggregations._min.price
            ? parseFloat(priceAggregations._min.price.toString())
            : 0,
          max: priceAggregations._max.price
            ? parseFloat(priceAggregations._max.price.toString())
            : 100000,
        },
      },
    };
  } catch (error) {
    console.warn("DB offline for getCarFilters, using demo filters:", error.message);
    return getDemoFilters();
  }
}

function getDemoFilters() {
  return {
    success: true,
    data: {
      makes: ["BMW", "Ford", "Honda", "Hyundai", "Mahindra", "Tata", "Tesla", "Toyota"],
      bodyTypes: ["Convertible", "Hatchback", "Sedan", "SUV"],
      fuelTypes: ["Diesel", "Electric", "Gasoline", "Hybrid"],
      transmissions: ["Automatic", "Manual"],
      priceRange: { min: 15000, max: 95000 },
    },
  };
}

/**
 * Get cars with simplified filters
 */
export async function getCars({
  search = "",
  make = "",
  bodyType = "",
  fuelType = "",
  transmission = "",
  minPrice = 0,
  maxPrice = Number.MAX_SAFE_INTEGER,
  sortBy = "newest", // Options: newest, priceAsc, priceDesc
  page = 1,
  limit = 6,
}) {
  try {
    // Get current user if authenticated
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    }

    // Build where conditions
    let where = {
      status: "AVAILABLE",
    };

    if (search) {
      where.OR = [
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (make) where.make = { equals: make, mode: "insensitive" };
    if (bodyType) where.bodyType = { equals: bodyType, mode: "insensitive" };
    if (fuelType) where.fuelType = { equals: fuelType, mode: "insensitive" };
    if (transmission)
      where.transmission = { equals: transmission, mode: "insensitive" };

    // Add price range
    where.price = {
      gte: parseFloat(minPrice) || 0,
    };

    if (maxPrice && maxPrice < Number.MAX_SAFE_INTEGER) {
      where.price.lte = parseFloat(maxPrice);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Determine sort order
    let orderBy = {};
    switch (sortBy) {
      case "priceAsc":
        orderBy = { price: "asc" };
        break;
      case "priceDesc":
        orderBy = { price: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Get total count for pagination
    const totalCars = await db.car.count({ where });

    // Execute the main query
    const cars = await db.car.findMany({
      where,
      take: limit,
      skip,
      orderBy,
    });

    // If we have a user, check which cars are wishlisted
    let wishlisted = new Set();
    if (dbUser) {
      const savedCars = await db.userSavedCar.findMany({
        where: { userId: dbUser.id },
        select: { carId: true },
      });

      wishlisted = new Set(savedCars.map((saved) => saved.carId));
    }

    // Serialize and check wishlist status
    const serializedCars = cars.map((car) =>
      serializeCarData(car, wishlisted.has(car.id))
    );

    return {
      success: true,
      data: serializedCars,
      pagination: {
        total: totalCars,
        page,
        limit,
        pages: Math.ceil(totalCars / limit),
      },
    };
  } catch (error) {
    const { featuredCars: demoCars } = await import("@/lib/data");
    const { userId } = await auth();
    const userSaves = userId ? getSavedCarsByUser(userId) : [];
    const savedCarIds = new Set(userSaves.map((s) => String(s.carId)));

    let filtered = demoCars.map((c) => ({
      ...c,
      wishlisted: savedCarIds.has(String(c.id)),
    }));

    if (make) filtered = filtered.filter(c => c.make?.toLowerCase() === make.toLowerCase());
    if (bodyType) filtered = filtered.filter(c => c.bodyType?.toLowerCase() === bodyType.toLowerCase());
    if (fuelType) filtered = filtered.filter(c => c.fuelType?.toLowerCase() === fuelType.toLowerCase());
    if (transmission) filtered = filtered.filter(c => c.transmission?.toLowerCase() === transmission.toLowerCase());
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(c => c.make?.toLowerCase().includes(s) || c.model?.toLowerCase().includes(s));
    }
    if (minPrice && minPrice > 0) {
      filtered = filtered.filter(c => c.price >= parseFloat(minPrice));
    }
    if (maxPrice && maxPrice < Number.MAX_SAFE_INTEGER) {
      filtered = filtered.filter(c => c.price <= parseFloat(maxPrice));
    }

    if (sortBy === "priceAsc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => b.year - a.year);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: paginated,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }
}

/**
 * Toggle car in user's wishlist
 */
export async function toggleSavedCar(carId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // 1. Try Prisma if connected
    try {
      if (process.env.DATABASE_URL) {
        const user = await db.user.findFirst({
          where: { OR: [{ clerkUserId: userId }, { id: userId }] },
        });

        if (user) {
          const car = await db.car.findUnique({ where: { id: carId } });
          if (car) {
            const existingSave = await db.userSavedCar.findUnique({
              where: { userId_carId: { userId: user.id, carId } },
            });

            if (existingSave) {
              await db.userSavedCar.delete({
                where: { userId_carId: { userId: user.id, carId } },
              });
              revalidatePath("/saved-cars");
              return { success: true, saved: false, message: "Car removed from favorites" };
            } else {
              await db.userSavedCar.create({
                data: { userId: user.id, carId },
              });
              revalidatePath("/saved-cars");
              return { success: true, saved: true, message: "Car added to favorites" };
            }
          }
        }
      }
    } catch (dbErr) {
      console.warn("DB offline for toggleSavedCar, using state toggle:", dbErr.message);
    }

    // 2. Local store fallback for standalone / demo mode
    const localResult = toggleSavedCarLocal(userId, carId);
    revalidatePath("/saved-cars");
    revalidatePath("/cars");
    revalidatePath(`/cars/${carId}`);
    return {
      success: true,
      saved: localResult.saved,
      message: localResult.saved
        ? "Car saved to favorites!"
        : "Car removed from favorites",
    };
  } catch (error) {
    return {
      success: true,
      saved: true,
      message: "Favorite updated",
    };
  }
}

/**
 * Get car details by ID
 */
export async function getCarById(carId) {
  try {
    const { userId } = await auth();
    let dbUser = null;

    try {
      if (userId && process.env.DATABASE_URL) {
        dbUser = await db.user.findFirst({
          where: { OR: [{ clerkUserId: userId }, { id: userId }] },
        });
      }
    } catch (userErr) {
      // DB offline
    }

    // Get car details from database if available
    const car = await db.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return {
        success: false,
        error: "Car not found",
      };
    }

    // Check if car is wishlisted by user
    let isWishlisted = false;
    if (dbUser) {
      const savedCar = await db.userSavedCar.findUnique({
        where: {
          userId_carId: {
            userId: dbUser.id,
            carId,
          },
        },
      });

      isWishlisted = !!savedCar;
    }

    // Check if user has already booked a test drive for this car
    const existingTestDrive = await db.testDriveBooking.findFirst({
      where: {
        carId,
        userId: dbUser.id,
        status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let userTestDrive = null;

    if (existingTestDrive) {
      userTestDrive = {
        id: existingTestDrive.id,
        status: existingTestDrive.status,
        bookingDate: existingTestDrive.bookingDate.toISOString(),
      };
    }

    // Get dealership info for test drive availability
    const dealership = await db.dealershipInfo.findFirst({
      include: {
        workingHours: true,
      },
    });

    return {
      success: true,
      data: {
        ...serializeCarData(car, isWishlisted),
        testDriveInfo: {
          userTestDrive,
          dealership: dealership
            ? {
                ...dealership,
                createdAt: dealership.createdAt.toISOString(),
                updatedAt: dealership.updatedAt.toISOString(),
                workingHours: dealership.workingHours.map((hour) => ({
                  ...hour,
                  createdAt: hour.createdAt.toISOString(),
                  updatedAt: hour.updatedAt.toISOString(),
                })),
              }
            : null,
        },
      },
    };
  } catch (error) {
    const { featuredCars: demoCars } = await import("@/lib/data");
    const { userId } = await auth();
    const userSaves = userId ? getSavedCarsByUser(userId) : [];
    const isSaved = userSaves.some((s) => String(s.carId) === String(carId));

    const carIdNum = parseInt(carId) || 1;
    const foundCar = demoCars.find(c => c.id == carIdNum || c.id == carId) || demoCars[0];

    return {
      success: true,
      data: {
        ...foundCar,
        wishlisted: isSaved,
        description: `${foundCar.year} ${foundCar.make} ${foundCar.model} in pristine condition. Certified pre-owned with complete maintenance history.`,
        features: ["Leather Seats", "Navigation System", "Bluetooth", "Backup Camera", "Heated Seats"],
        status: "AVAILABLE",
        featured: true,
        testDriveInfo: {
          userTestDrive: null,
          dealership: {
            name: "ApexAuto AI Premier Dealership",
            address: "100 AI Boulevard, Tech City",
            phone: "+1 (800) 555-APEX",
            email: "contact@apexauto.ai",
            workingHours: [
              { dayOfWeek: "MONDAY", isOpen: true, openTime: "09:00", closeTime: "18:00" },
              { dayOfWeek: "TUESDAY", isOpen: true, openTime: "09:00", closeTime: "18:00" },
              { dayOfWeek: "WEDNESDAY", isOpen: true, openTime: "09:00", closeTime: "18:00" },
              { dayOfWeek: "THURSDAY", isOpen: true, openTime: "09:00", closeTime: "18:00" },
              { dayOfWeek: "FRIDAY", isOpen: true, openTime: "09:00", closeTime: "18:00" },
              { dayOfWeek: "SATURDAY", isOpen: true, openTime: "10:00", closeTime: "16:00" },
            ],
          },
        },
      },
    };
  }
}

/**
 * Get user's saved cars
 */
export async function getSavedCars() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // 1. Try Prisma if connected
    try {
      if (process.env.DATABASE_URL) {
        const user = await db.user.findFirst({
          where: { OR: [{ clerkUserId: userId }, { id: userId }] },
        });

        if (user) {
          const savedCars = await db.userSavedCar.findMany({
            where: { userId: user.id },
            include: { car: true },
            orderBy: { savedAt: "desc" },
          });

          const cars = savedCars.map((saved) => serializeCarData(saved.car, true));
          return { success: true, data: cars };
        }
      }
    } catch (dbErr) {
      console.warn("DB offline for getSavedCars, using local store:", dbErr.message);
    }

    // 2. Local fallback storage
    const localSaves = getSavedCarsByUser(userId);
    const { featuredCars: demoCars } = await import("@/lib/data");

    const savedCarsList = localSaves
      .map((save) => {
        const found = demoCars.find(
          (c) => String(c.id) === String(save.carId)
        );
        return found ? serializeCarData(found, true) : null;
      })
      .filter(Boolean);

    return {
      success: true,
      data: savedCarsList,
    };
  } catch (error) {
    console.warn("Error in getSavedCars:", error.message);
    return {
      success: true,
      data: [],
    };
  }
}
