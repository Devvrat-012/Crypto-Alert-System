import { Request, Response, Router } from "express";
import { fetchCryptoPrice } from "../services/coingeckoService";
import { setCache, getCache } from "../services/cacheService";

const priceRouter = Router();

priceRouter.get("/:currency", async (req: Request, res: Response) => {
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
      price = await getCache(currency);
    } catch (cacheError) {
      console.error(`Cache error for currency ${currency}:`, cacheError);
    }

    // If price is not found in cache, fetch it from the external API
    if (!price) {
      try {
        price = await fetchCryptoPrice(currency);
      } catch (apiError) {
        console.error(`API error fetching price for ${currency}:`, apiError);
        return res.status(502).json({
          error: "Failed to fetch cryptocurrency price from external API.",
        });
      }

      // Attempt to set the price in the cache
      try {
        await setCache(currency, price);
      } catch (cacheSetError) {
        console.error(
          `Cache set error for currency ${currency}:`,
          cacheSetError
        );
      }
    }

    // Send the response with the currency and price
    res.json({ currency, price });
  } catch (generalError) {
    console.error(
      `General error processing request for currency ${currency}:`,
      generalError
    );
    res.status(500).json({ error: "Internal server error." });
  }
});

export default priceRouter;
