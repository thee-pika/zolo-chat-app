import express from "express";
import { loginHandler, signUpHandler, userDetails } from "../controller/user";
import { isAuthenticted } from "../middleware/AuthMiddleware";

export const userRouter = express();

userRouter.post("/login", loginHandler);

userRouter.post("/signup", signUpHandler);

userRouter.get("/user", isAuthenticted , userDetails);
