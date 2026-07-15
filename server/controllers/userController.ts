import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middlewares/auth";
import Resume from "../models/Resume";

const generateToken = (userId: string) => {
   const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
   return token;
}

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
   try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
         return res.status(400).json({ message: "All fields are required" });
      }

      const user = await User.findOne({ email });
      if (user) {
         return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ name, email, password: hashedPassword });

      const token = generateToken(newUser._id.toString());
      newUser.password = undefined as any;

      return res.status(201).json({ message: "User created successfully", token, user: newUser });

   } catch (error: any) {
      return res.status(400).json({ message: error.message });
   }
}

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
   try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
         return res.status(400).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = generateToken(user._id.toString());
      user.password = undefined as any;

      return res.status(200).json({ message: "Login successful", token, user });

   } catch (error: any) {
      return res.status(400).json({ message: error.message });
   }
}

export const getUserById = async (req: AuthRequest, res: Response): Promise<Response> => {
   try {
      const userId = req.userId;

      const user = await User.findById(userId)
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      user.password = undefined as any;
      return res.status(200).json({ user });

   } catch (error: any) {
      return res.status(400).json({ message: error.message });
   }
}


export const getUserResumes = async (req: AuthRequest, res: Response): Promise<Response> => {
   try {
      const userId = req.userId as string;

      const resumes = await Resume.find({ userId });
      return res.status(200).json({ resumes });
   } catch (error: any) {
      return res.status(400).json({ message: error.message });
   }
}

