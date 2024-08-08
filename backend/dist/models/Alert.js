import mongoose, { Schema } from "mongoose";
const AlertSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        validate: {
            validator: mongoose.Types.ObjectId.isValid,
            message: "Invalid userId format.",
        },
    },
    currency: {
        type: String,
        required: [true, "Currency is required."],
        trim: true,
    },
    targetPrice: {
        type: Number,
        required: [true, "Target price is required."],
        min: [0, "Target price must be greater than 0."],
    },
    direction: {
        type: String,
        enum: ["above", "below"],
        required: [true, "Direction is required."],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export const Alert = mongoose.model("Alert", AlertSchema);
