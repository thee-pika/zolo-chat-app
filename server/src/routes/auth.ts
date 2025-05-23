import express from "express";
import { loginHandler, logoutHandler, signUpHandler } from "../controller/user";
import { uploadSingle } from "../middleware/multer";
import { isAuthenticted } from "../middleware/auth";
export const authRouter = express();

authRouter.post("/login", loginHandler);

authRouter.post("/signup", uploadSingle, signUpHandler);

authRouter.get("/logout", isAuthenticted, logoutHandler);
