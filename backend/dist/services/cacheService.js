var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
export const setCache = (key_1, value_1, ...args_1) => __awaiter(void 0, [key_1, value_1, ...args_1], void 0, function* (key, value, expiry = 60) {
    try {
        if (!key || typeof key !== "string") {
            throw new Error("Key must be a valid non-empty string.");
        }
        if (typeof value === "undefined") {
            throw new Error("Value must be defined.");
        }
        yield RedisClient.set(key, JSON.stringify(value), { EX: expiry });
    }
    catch (error) {
        console.error(`Failed to set cache for key ${key}:`, error);
        throw new Error("Cache set operation failed.");
    }
});
export const getCache = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!key || typeof key !== "string") {
            throw new Error("Key must be a valid non-empty string.");
        }
        const data = yield RedisClient.get(key);
        return data ? JSON.parse(data) : null;
    }
    catch (error) {
        console.error(`Failed to get cache for key ${key}:`, error);
        throw new Error("Cache get operation failed.");
    }
});
