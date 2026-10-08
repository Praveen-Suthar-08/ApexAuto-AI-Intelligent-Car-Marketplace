import fs from "fs";
import path from "path";

const SAVED_CARS_FILE = path.join(process.cwd(), "saved-cars-local.json");

export function readSavedCars() {
  try {
    if (fs.existsSync(SAVED_CARS_FILE)) {
      const data = fs.readFileSync(SAVED_CARS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading saved cars store:", err);
  }
  return [];
}

export function writeSavedCars(items) {
  try {
    fs.writeFileSync(SAVED_CARS_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing saved cars store:", err);
  }
}

export function toggleSavedCarLocal(userId, carId) {
  const items = readSavedCars();
  const cId = String(carId);
  const uId = String(userId);

  const existingIndex = items.findIndex(
    (item) => String(item.userId) === uId && String(item.carId) === cId
  );

  if (existingIndex !== -1) {
    // Remove
    items.splice(existingIndex, 1);
    writeSavedCars(items);
    return { saved: false };
  } else {
    // Add
    items.push({
      id: "save_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      userId: uId,
      carId: cId,
      savedAt: new Date().toISOString(),
    });
    writeSavedCars(items);
    return { saved: true };
  }
}

export function getSavedCarsByUser(userId) {
  const items = readSavedCars();
  const uId = String(userId);
  return items.filter((item) => String(item.userId) === uId);
}
