import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

// Initialize Redis client with enhanced error handling
export const RedisClient = createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_URI,
    port: 16707,
  },
});

// Error event listener for Redis client
RedisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
  process.exit(1);
});

// Connect to Redis
RedisClient.connect()
  .then(() => console.log("Redis client connected"))
  .catch((err) => {
    console.error("Redis client connection failed:", err);
    process.exit(1);
  });

export const setCache = async (
  key: string,
  value: any,
  expiry: number = 60
) => {
  try {
    if (!key || typeof key !== "string") {
      throw new Error("Key must be a valid non-empty string.");
    }
    if (typeof value === "undefined") {
      throw new Error("Value must be defined.");
    }

    await RedisClient.set(key, JSON.stringify(value), { EX: expiry });
  } catch (error) {
    console.error(`Failed to set cache for key ${key}:`, error);
    throw new Error("Cache set operation failed.");
  }
};

export const getCache = async (key: string) => {
  try {
    if (!key || typeof key !== "string") {
      throw new Error("Key must be a valid non-empty string.");
    }

    const data = await RedisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Failed to get cache for key ${key}:`, error);
    throw new Error("Cache get operation failed.");
  }
};
