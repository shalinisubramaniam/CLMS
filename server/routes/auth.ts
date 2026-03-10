import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { generateToken } from "../auth";
import { UserRole } from "@shared/api";
import { isDbConnected } from "../db";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@clms.com";

export const handleSignup: RequestHandler = async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({
      message: "Database not connected. Please set up MONGODB_URI or connect via MCP."
    });
  }

  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole: UserRole = email === ADMIN_EMAIL ? "admin" : role || "student";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole
    });

    const token = generateToken(user._id.toString(), user.role as UserRole);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        badges: user.badges,
        streaks: user.streaks
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({
      message: "Database not connected. Please set up MONGODB_URI or connect via MCP."
    });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Role check for admin is done at signup time or when env changes
    if (email === ADMIN_EMAIL && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    const token = generateToken(user._id.toString(), user.role as UserRole);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        badges: user.badges,
        streaks: user.streaks
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
