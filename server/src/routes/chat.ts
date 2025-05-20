import express from "express";
import {
  addMembers,
  createGroupChat,
  deleteChat,
  deleteGroupChats,
  getAllMyChats,
  getChatDetails,
  getGroupChatsById,
  getMessages,
  getMyGroups,
  leaveGroup,
  removeMemberFromGroup,
  renameGroup,
  sendAttachments,
  updateGroupChats,
} from "../controller/chat";
import { isAuthenticted } from "../middleware/AuthMiddleware";
import { attachmentsMulter } from "../middleware/multer";

export const chatRouter = express.Router();

chatRouter.use(isAuthenticted);

chatRouter.post("/", createGroupChat);

chatRouter.get("/", getAllMyChats);

chatRouter.get("/details/:id", getChatDetails);

chatRouter.put("/:id", updateGroupChats);

chatRouter.delete("/:id", deleteGroupChats);

chatRouter.get("/:id", getGroupChatsById);

chatRouter.get("/groups/my", getMyGroups);

chatRouter.post("/group/member", addMembers);

chatRouter.delete("/group/member", removeMemberFromGroup);

chatRouter.delete("/group/leave/:id", leaveGroup);

chatRouter.post("/message", attachmentsMulter, sendAttachments);

chatRouter.post("/group/rename", renameGroup);

chatRouter.get("/message/:id", getMessages);

chatRouter.delete("/chat/:id", deleteChat);
