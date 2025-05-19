import {
  chatSchema,
  addMembersSchema,
  removeMemberSchema,
  AttachmentsSchema,
} from "../../types/types";
import { TryCatch } from "../middleware/error";
import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/utility";
import { prisma } from "../../db";
import { deleteFilesFromCloudinary, emitEvent } from "../utils/feature";
import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../utils/event";
import { findUserById, getOtherMember } from "../lib/helper";

const createGroupChat = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = chatSchema.safeParse(req.body);

    if (!parsedData.success) {
      next(new ErrorHandler("Invalid input data", 400));
      return;
    }

    const { members, chatName, avatar } = parsedData.data;
    console.log("members", members);

    const allMembers = [...members, req.userId].filter(
      (member): member is string => !!member
    );

    if (!allMembers.length) {
      next(new ErrorHandler("No valid members found", 400));
      return;
    }

    const chat = await prisma.chat.create({
      data: {
        groupChat: true,
        creator: req.userId,
        members: allMembers,
        chatName,
        avatar,
      },
    });

    emitEvent(req, ALERT, allMembers, `welcome to ${chatName} group.`);
    emitEvent(req, REFETCH_CHATS, allMembers, "");

    res.status(200).json({ message: "user created successfully", id: chat.id });
    return;
  }
);

const getAllMyChats = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const chats = await prisma.chat.findMany({
      where: {
        members: {
          has: req.userId,
        },
      },
    });

    const transformedChats = chats.map(async (chat) => {
      const { chatName, avatar, id, groupChat, creator, members } = chat;
      const otherMemeberId = getOtherMember(members, req.userId!);

      if (!otherMemeberId) {
        return;
      }

      const otherUser = await findUserById(otherMemeberId);

      if (!otherUser) {
        return;
      }

      return {
        id: id,
        name: groupChat ? chatName : otherUser.name,
        groupChat: groupChat,
        members: members.reduce<string[]>((prev, curr) => {
          if (curr.toString() !== req.userId?.toString()) {
            prev.push(curr);
          }
          return prev;
        }, []),
        avatar: avatar,
      };
    });

    res.json({
      success: true,
      chats: transformedChats,
    });

    return;
  }
);

const deleteGroupChats = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {}
);

const getGroupChatsById = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {}
);

const getMyGroups = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const chats = await prisma.chat.findMany({
      where: {
        members: {
          has: req.userId,
        },
        groupChat: true,
        creator: req.userId,
      },
    });

    res.json({ chats });
  }
);

const addMembers = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = addMembersSchema.safeParse(req.body);

    if (!parsedData.success) {
      next(new ErrorHandler("Invalid input data", 400));
      return;
    }

    const { members, chatId } = parsedData.data;

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
      },
      select: {
        groupChat: true,
        chatName: true,
        members: true,
        creator: true,
      },
    });

    if (!chat) {
      next(new ErrorHandler("Chat not found", 404));
      return;
    }

    if (!chat.groupChat) {
      next(new ErrorHandler("Chat not found", 404));
      return;
    }

    if (chat.creator?.toString() !== req.userId?.toString()) {
      next(new ErrorHandler("Access DENIED", 403));
      return;
    }

    const uniqueMembers = members
      .filter((m) => !chat.members.includes(m))
      .map((i) => i);

    const groupLimit = chat.members.length + uniqueMembers.length > 100;

    if (groupLimit) {
      next(new ErrorHandler("Group Limit Reached ...", 400));
      return;
    }

    const updatedChat = await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        members: {
          push: uniqueMembers,
        },
      },
    });

    emitEvent(
      req,
      ALERT,
      chat.members,
      `you have been added to ${chat.chatName} Group..`
    );

    res.json({
      success: true,
      message: "Members added successfully",
    });
  }
);

const removeMemberFromGroup = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = await removeMemberSchema.safeParse(req.body);

    if (!parsedData.success) {
      next(new ErrorHandler("Invalid input data", 400));
      return;
    }

    const { userId, chatId } = parsedData.data;

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
      },
      select: {
        groupChat: true,
        chatName: true,
        members: true,
        creator: true,
      },
    });

    if (!chat) {
      next(new ErrorHandler("Chat not found", 404));
      return;
    }

    if (!chat.groupChat) {
      next(new ErrorHandler("Chat not found", 404));
      return;
    }

    if (chat.creator?.toString() !== req.userId?.toString()) {
      next(new ErrorHandler("Access DENIED", 403));
      return;
    }

    const chatMemebers = chat.members.filter((m) => m.toString() !== userId);

    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        members: chatMemebers,
      },
    });

    emitEvent(
      req,
      ALERT,
      chat.members,
      `user have been removed from ${chat.chatName} Group..`
    );
    emitEvent(req, REFETCH_CHATS, chat.members);

    res.json({
      success: true,
      message: "Member removed successfully",
    });
  }
);

const leaveGroup = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.id;

    if (!chatId) {
      next(new ErrorHandler("chatId not found", 404));
      return;
    }

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
      },
    });

    if (!chat) {
      next(new ErrorHandler("Chat not found", 404));
      return;
    }

    if (!chat.groupChat) {
      next(new ErrorHandler("Chat not found", 404));
      return;
    }

    let isCreator = false;

    if (chat.creator?.toString() === req.userId?.toString()) {
      isCreator = true;
    }

    const newChatMemebers = chat.members.filter(
      (m) => m.toString() !== req.userId?.toString()
    );

    const idx = Math.floor(Math.random() * newChatMemebers.length);

    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        creator: isCreator ? newChatMemebers[idx] : chat.creator,
        members: newChatMemebers,
      },
    });

    emitEvent(
      req,
      ALERT,
      newChatMemebers,
      `user have been left the ${chat.chatName} Group..`
    );
    emitEvent(req, REFETCH_CHATS, newChatMemebers);

    res.json({
      success: true,
      message: "successfully user left frm group .",
    });
    return;
  }
);

const sendAttachments = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.body;

    if (!chatId) {
      next(new ErrorHandler("chatId not found", 404));
      return;
    }

    const [chat, user] = await Promise.all([
      prisma.chat.findFirst({
        where: {
          id: chatId,
        },
      }),
      prisma.user.findFirst({
        where: {
          id: req.userId,
        },
      }),
    ]);

    const files = req.files || [];

    if (!chat) {
      next(new ErrorHandler("Chat not found", 404));
      return;
    }

    if (!user) {
      next(new ErrorHandler("user not found", 404));
      return;
    }
    if (Array.isArray(files) && files.length < 1) {
      next(new ErrorHandler("No files provided", 400));
      return;
    }

    const attachments = [];

    const messageForRealTime = {
      content: "",
      attachments,
      sender: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
      chatId,
    };

    const messageForDB = {
      content: "",
      attachments,
      senderId: user.id,
      chatId,
    };

    const message = await prisma.message.create({
      data: {
        sender: messageForDB.senderId,
        content: messageForDB.content,
        attachments: messageForDB.attachments,
        chatId: messageForDB.chatId,
      },
    });

    emitEvent(req, NEW_ATTACHMENT, chat.members, {
      message: messageForRealTime,
      chatId,
    });

    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, {
      chatId,
    });

    res.json({
      success: true,
      message: "Attachments  sent successfully .",
      messageAdded: message,
    });

    return;
  }
);

const getChatDetails = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.id;

    if (!chatId) {
      next(new ErrorHandler("chatId not found", 404));
      return;
    }

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
      },
    });

    if (!chat) {
      next(new ErrorHandler("Chat not found", 404));
      return;
    }

    res.json({
      success: true,
      message: "Attachments  sent successfully .",
      chat,
    });
  }
);

const updateGroupChats = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {}
);

const renameGroup = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.id;

    if (!chatId) {
      next(new ErrorHandler("chatId not found", 404));
      return;
    }

    const { name } = req.body;
    if (!name) {
      next(new ErrorHandler("name is required to rename the group", 404));
      return;
    }
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
      },
    });

    if (!chat) {
      next(new ErrorHandler("Chat not found", 404));
      return;
    }

    if (!chat.groupChat) {
      next(new ErrorHandler("Chat is not a groupChat", 404));
      return;
    }

    if (chat.creator?.toString() !== req.userId?.toString()) {
      next(new ErrorHandler("Access DENIED", 403));
      return;
    }

    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        chatName: name,
      },
    });

    res.json({
      success: true,
      message: "group name successfully .",
    });
  }
);

const deleteChat = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.id;

    if (!chatId) {
      next(new ErrorHandler("chatId not found", 404));
      return;
    }

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
      },
    });

    if (!chat) {
      next(new ErrorHandler("Chat not found", 404));
      return;
    }

    if (chat.groupChat && chat.creator?.toString() !== req.userId?.toString()) {
      next(new ErrorHandler("ACCESS DENIED", 404));
      return;
    }

    const messagesWithAttachMents = await prisma.message.findMany({
      where: {
        id: chatId,
        attachments: {
          some: {},
        },
      },
      select: {
        attachments: true,
      },
    });

    const public_ids: string[] = [];

    messagesWithAttachMents.forEach(({ attachments }) =>
      attachments.map(({ public_id }) => public_ids.push(public_id))
    );

    await Promise.all([
      deleteFilesFromCloudinary(public_ids),
      prisma.chat.delete({
        where: {
          id: chatId,
        },
      }),
      prisma.message.deleteMany({
        where: {
          chatId,
        },
      }),
    ]);

    emitEvent(req, REFETCH_CHATS, chat.members);

    res.json({
      success: true,
      message: "chat deleted successfully .",
    });
    return;
  }
);

const getMessages = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.id;

    const page =
      typeof req.query.page === "string" ? parseInt(req.query.page) : 1;

    const limit = 20;

    const skip = (page - 1) * limit;

    const [messages, totalMessages] = await Promise.all([
      prisma.message.findMany({
        where: {
          chatId,
        },
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.message.count(),
    ]);

    const totalPages = Math.ceil(totalMessages / limit);

    res.json({
      messages,
      totalPages,
      currentPage: page,
    });
  }
);

export {
  getGroupChatsById,
  deleteGroupChats,
  updateGroupChats,
  getAllMyChats,
  createGroupChat,
  getMyGroups,
  addMembers,
  removeMemberFromGroup,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  getMessages,
  deleteChat,
};
