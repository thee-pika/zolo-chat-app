import express from "express";
import { userRouter } from "./user";
import { chatRouter } from "./chat";
import { adminRouter } from "./admin";
import { authRouter } from "./auth";
export const router = express.Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/chat", chatRouter);
router.use("/auth", authRouter);
