import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@shared/api";

const JWT_SECRET = process.env.JWT_SECRET || "clms-secret-key-12345";

export const generateToken = (userId: string, role: UserRole) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, role: UserRole };
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (user && user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, admin only" });
  }
};

export const instructorOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (user && (user.role === "instructor" || user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied, instructor only" });
  }
};
