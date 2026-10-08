import { PrismaClient } from "@prisma/client";

const hasDbUrl =
  process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "";

let basePrisma = null;

if (hasDbUrl) {
  try {
    basePrisma =
      globalThis.prisma ||
      new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL.includes("connect_timeout")
          ? process.env.DATABASE_URL
          : `${process.env.DATABASE_URL}${process.env.DATABASE_URL.includes("?") ? "&" : "?"}connect_timeout=1&pool_timeout=1`,
        log: ["warn", "error"],
      });

    if (process.env.NODE_ENV !== "production") {
      globalThis.prisma = basePrisma;
    }
  } catch (e) {
    console.warn("Prisma init warning:", e.message);
  }
}

// Recursive dummy handler so any db.<model>.<method>() call returns a rejecting Promise
const createDummyProxy = () => {
  return new Proxy(() => Promise.reject(new Error("DB_OFFLINE: No database connected")), {
    get(target, prop) {
      if (prop === "then") return undefined; // Prevent false Promise detection
      return createDummyProxy();
    },
    apply() {
      return Promise.reject(new Error("DB_OFFLINE: No database connected"));
    },
  });
};

export const db = basePrisma
  ? new Proxy(basePrisma, {
      get(target, prop) {
        const orig = target[prop];
        if (typeof orig === "object" && orig !== null) {
          return new Proxy(orig, {
            get(modelTarget, modelProp) {
              const fn = modelTarget[modelProp];
              if (typeof fn === "function") {
                return function (...args) {
                  const promise = fn.apply(modelTarget, args);
                  const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(
                      () =>
                        reject(
                          new Error(
                            "DB_FAST_TIMEOUT: Database server did not respond within 400ms"
                          )
                        ),
                      400
                    )
                  );
                  return Promise.race([promise, timeoutPromise]);
                };
              }
              return fn;
            },
          });
        }
        return orig;
      },
    })
  : createDummyProxy();


