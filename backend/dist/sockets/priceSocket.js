var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Server as SocketIOServer } from "socket.io";
import { fetchCryptoPrice } from "../services/coingeckoService";
import { Alert } from "../models/Alert";
import { getCache, setCache } from "../services/cacheService";
const CACHE_EXPIRY = 60; // Cache expiry in seconds
export const initializeSockets = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
    // Monitor prices and emit alerts
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const alerts = yield Alert.find();
            for (const alert of alerts) {
                try {
                    // Check cache first
                    const cacheKey = `price_${alert.currency}`;
                    const cachedPrice = yield getCache(cacheKey);
                    let currentPrice;
                    if (cachedPrice) {
                        currentPrice = cachedPrice;
                    }
                    else {
                        currentPrice = yield fetchCryptoPrice(alert.currency);
                        yield setCache(cacheKey, currentPrice, CACHE_EXPIRY);
                    }
                    const conditionMet = (alert.direction === "above" &&
                        currentPrice >= alert.targetPrice) ||
                        (alert.direction === "below" && currentPrice <= alert.targetPrice);
                    if (conditionMet) {
                        io.emit("priceAlert", {
                            currency: alert.currency,
                            targetPrice: alert.targetPrice,
                            currentPrice,
                            direction: alert.direction,
                        });
                    }
                }
                catch (alertError) {
                    console.error(`Error processing alert for currency ${alert.currency}:`, alertError);
                }
            }
        }
        catch (error) {
            console.error("Error in price monitoring:", error);
        }
    }), 60000); // Check every minute
};
