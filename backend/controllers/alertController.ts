import { Request, Response, Router } from "express";
import { Alert } from "../models/Alert";

const alertRouter = Router();

alertRouter.post("/", async (req: Request, res: Response) => {
  const { userId, currency, targetPrice, direction } = req.body;

  if (!userId || !currency || !targetPrice || !direction) {
    return res.status(400).json({
      error:
        "All fields (userId, currency, targetPrice, direction) are required.",
    });
  }

  if (typeof targetPrice !== "number" || targetPrice <= 0) {
    return res
      .status(400)
      .json({ error: "Target price must be a positive number." });
  }

  try {
    // Create and save the new alert
    const alert = new Alert({ userId, currency, targetPrice, direction });
    await alert.save();

    res.status(201).json(alert);
  } catch (error: any) {
    console.error("Error creating alert:", error);

    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation error: " + error.message });
    }
    res.status(500).json({ error: "Failed to create alert" });
  }
});

export default alertRouter;
