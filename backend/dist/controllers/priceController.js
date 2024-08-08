var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import { fetchCryptoPrice } from "../services/coingeckoService.js";
import { setCache, getCache } from "../services/cacheService.js";
const priceRouter = Router();
priceRouter.get("/:currency", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currency } = req.params;
    // Validate the 'currency' parameter
    if (!currency || typeof currency !== "string") {
        return res.status(400).json({
            error: "Currency parameter is required and must be a valid string.",
        });
    }
    try {
        // Try to get the price from cache
        let price;
        try {
            price = yield getCache(currency);
        }
        catch (cacheError) {
            console.error(`Cache error for currency ${currency}:`, cacheError);
        }
        // If price is not found in cache, fetch it from the external API
        if (!price) {
            try {
                price = yield fetchCryptoPrice(currency);
            }
            catch (apiError) {
                console.error(`API error fetching price for ${currency}:`, apiError);
                return res.status(502).json({
                    error: "Failed to fetch cryptocurrency price from external API.",
                });
            }
            // Attempt to set the price in the cache
            try {
                yield setCache(currency, price);
            }
            catch (cacheSetError) {
                console.error(`Cache set error for currency ${currency}:`, cacheSetError);
            }
        }
        // Send the response with the currency and price
        res.json({ currency, price });
    }
    catch (generalError) {
        console.error(`General error processing request for currency ${currency}:`, generalError);
        res.status(500).json({ error: "Internal server error." });
    }
}));
export default priceRouter;
