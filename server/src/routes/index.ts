import express from "express";
import { userRouter } from "./user";
import { chatRouter } from "./chat";
export const router = express.Router();

router.use("/auth", userRouter);
router.use("/admin", userRouter);
router.use("/chat", chatRouter);

