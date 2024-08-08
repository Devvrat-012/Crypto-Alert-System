import { Server as SocketIOServer } from "socket.io";
import http from "http";
import { fetchCryptoPrice } from "../services/coingeckoService";
import { Alert } from "../models/Alert";
import { getCache, setCache } from "../services/cacheService";

const CACHE_EXPIRY = 60; // Cache expiry in seconds

export const initializeSockets = (server: http.Server) => {
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
  setInterval(async () => {
    try {
      const alerts = await Alert.find();

      for (const alert of alerts) {
        try {
          // Check cache first
          const cacheKey = `price_${alert.currency}`;
          const cachedPrice = await getCache(cacheKey);

          let currentPrice: number;

          if (cachedPrice) {
            currentPrice = cachedPrice;
          } else {
            currentPrice = await fetchCryptoPrice(alert.currency);
            await setCache(cacheKey, currentPrice, CACHE_EXPIRY);
          }

          const conditionMet =
            (alert.direction === "above" &&
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
        } catch (alertError) {
          console.error(
            `Error processing alert for currency ${alert.currency}:`,
            alertError
          );
        }
      }
    } catch (error) {
      console.error("Error in price monitoring:", error);
    }
  }, 60000); // Check every minute
};
