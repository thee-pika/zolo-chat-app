import express from "express";
import {
  loginHandler,
  logoutHandler,
  signUpHandler,
  userDetails,
} from "../controller/user";
import { isAuthenticted } from "../middleware/auth";
import { uploadSingle } from "../middleware/multer";

export const userRouter = express();

userRouter.post("/login", loginHandler);

userRouter.post("/signup", uploadSingle, signUpHandler);

userRouter.get("/user", isAuthenticted, userDetails);

userRouter.get("/logout", isAuthenticted, logoutHandler);
