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
import { Alert } from "../models/Alert.js";
const alertRouter = Router();
alertRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, currency, targetPrice, direction } = req.body;
    if (!userId || !currency || !targetPrice || !direction) {
        return res.status(400).json({
            error: "All fields (userId, currency, targetPrice, direction) are required.",
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
        yield alert.save();
        res.status(201).json(alert);
    }
    catch (error) {
        console.error("Error creating alert:", error);
        if (error.name === "ValidationError") {
            return res
                .status(400)
                .json({ error: "Validation error: " + error.message });
        }
        res.status(500).json({ error: "Failed to create alert" });
    }
}));
export default alertRouter;
