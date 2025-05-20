import express from "express";
import {
  adminVerifyHanlder,
  getAllChatsHandler,
  getAllMessagesHandler,
  GetAllUsersHandler,
  GetRequestHandler,
  statsHandler,
  adminLogoutHandler
} from "../controller/admin";
import { logoutHandler } from "../controller/user";

export const adminRouter = express.Router();

adminRouter.get("/", GetRequestHandler);

adminRouter.get("/users", GetAllUsersHandler);

adminRouter.get("/chats", getAllChatsHandler);

adminRouter.post("/verify", adminVerifyHanlder);

adminRouter.get("/logout", logoutHandler);

adminRouter.get("/messages", getAllMessagesHandler);

adminRouter.get("/stats", statsHandler);

adminRouter.get("/logout", adminLogoutHandler);