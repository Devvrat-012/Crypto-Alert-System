var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Router } from "express";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
dotenv.config();
// Register a new user
export const registerRouter = Router();
registerRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = yield User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash the password
        const hashedPassword = yield bcrypt.hash(password, 12);
        // Create the new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        yield newUser.save();
        // Exclude the password from the response
        const _a = newUser.toObject(), { password: _ } = _a, rest = __rest(_a, ["password"]);
        return res
            .status(201)
            .json({ message: "User registered successfully", user: rest });
    }
    catch (error) {
        console.error("Error during user registration:", error);
        return res
            .status(500)
            .json({
            message: "Something went wrong",
            error: error.message,
        });
    }
}));
// Login an existing user
export const loginRouter = Router();
loginRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
        // Find the user by username
        const user = yield User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Compare the password
        const isPasswordCorrect = yield bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        // Exclude the password from the response
        const _a = user.toObject(), { password: _ } = _a, rest = __rest(_a, ["password"]);
        return res.status(200).json({ user: rest, token });
    }
    catch (error) {
        console.error("Error during user login:", error);
        return res
            .status(500)
            .json({
            message: "Something went wrong",
            error: error.message,
        });
    }
}));
