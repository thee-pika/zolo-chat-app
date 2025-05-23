import express from "express";
import {
  acceptFriendRequest,
  getAllNotifications,
  getMyFriends,
  searchUser,
  sendFriendRequest,
  userDetails,
} from "../controller/user";
import { isAuthenticted } from "../middleware/auth";

export const userRouter = express();

userRouter.get("/", isAuthenticted, userDetails);

userRouter.get("/search", searchUser);

userRouter.put("sendRequest", sendFriendRequest);

userRouter.put("acceptRequest", acceptFriendRequest);

userRouter.get("/notifications", getAllNotifications);

userRouter.get("/friends", getMyFriends);
