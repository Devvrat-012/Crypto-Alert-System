import { Request, Response, Router } from "express";
import dotenv from "dotenv";
import { User, IUser } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

dotenv.config();

// Register a new user
export const registerRouter = Router();
registerRouter.post(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create the new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      }) as IUser;

      await newUser.save();

      // Exclude the password from the response
      const { password: _, ...rest } = newUser.toObject();

      return res
        .status(201)
        .json({ message: "User registered successfully", user: rest });
    } catch (error) {
      console.error("Error during user registration:", error);
      return res
        .status(500)
        .json({
          message: "Something went wrong",
          error: (error as Error).message,
        });
    }
  }
);
// Login an existing user
export const loginRouter = Router();
loginRouter.post(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare the password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        }
      );

      // Exclude the password from the response
      const { password: _, ...rest } = user.toObject();

      return res.status(200).json({ user: rest, token });
    } catch (error) {
      console.error("Error during user login:", error);
      return res
        .status(500)
        .json({
          message: "Something went wrong",
          error: (error as Error).message,
        });
    }
  }
);
