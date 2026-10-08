import arcjet, { tokenBucket } from "@arcjet/next";

let ajInstance = null;

if (process.env.ARCJET_KEY && process.env.ARCJET_KEY.trim() !== "") {
  try {
    ajInstance = arcjet({
      key: process.env.ARCJET_KEY,
      characteristics: ["ip.src"],
      rules: [
        tokenBucket({
          mode: "LIVE",
          refillRate: 10,
          interval: 3600,
          capacity: 10,
        }),
      ],
    });
  } catch (err) {
    console.warn("ArcJet init warning:", err.message);
  }
}

// Fallback dummy object if ARCJET_KEY is not configured
const aj = ajInstance || {
  protect: async () => ({ isDenied: () => false, isAllowed: () => true }),
};

export default aj;

