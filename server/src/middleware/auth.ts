import { Request, Response, NextFunction } from "express";
import { TryCatch } from "./error";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { ErrorHandler } from "../utils/utility";
config();

const isAuthenticted = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["access_token"];

    if (!token) {
      next(new ErrorHandler("token not found", 400));
      return;
    }

    const decodedData = await jwt.verify(token, process.env.JWT_SECRET!);

    if (
      decodedData !== null &&
      typeof decodedData === "object" &&
      "id" in decodedData
    ) {
      req.userId = decodedData.id;
    }
    next();
  }
);

const isAdmin = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["admin-token"];

    if (!token) {
      next(new ErrorHandler("token not found", 400));
      return;
    }

    const decodedData = await jwt.verify(token, process.env.JWT_SECRET!);

    if (
      decodedData !== null &&
      typeof decodedData === "object" &&
      "isAdmin" in decodedData
    ) {
      req.isAdmin = decodedData.isAdmin;
    }
    next();
  }
);

export { isAdmin, isAuthenticted };
