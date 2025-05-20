import { Request, Response } from "express";
import { prisma } from "../../db";
import { cookieOptions } from "../utils/feature";
import { createAdminToken } from "../utils/createToken";

const GetRequestHandler = (req: Request, res: Response) => {
  res.status(200).json({ message: "Get request successful" });
};

const GetAllUsersHandler = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({});
  const transformedUsers = users.map(async ({ id, name, avatar }) => {
    const [groups, friends] = await Promise.all([
      prisma.chat.count({
        where: {
          members: {
            has: id,
          },
          groupChat: true,
        },
      }),
      prisma.chat.count({
        where: {
          members: {
            has: id,
          },
          groupChat: false,
        },
      }),
    ]);

    return {
      id,
      avatar,
      name,
      groups,
      friends,
    };
  });

  res
    .status(200)
    .json({ message: "Get all users successful", data: transformedUsers });
};

const getAllMessagesHandler = async (req: Request, res: Response) => {
  const messages = await prisma.message.findMany({});

  const transformedMessages = await Promise.all(
    messages.map(async ({ id, senderId, chatId, content }) => {
      const [sender, chat] = await Promise.all([
        prisma.user.findFirst({
          where: { id: senderId },
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        }),
        prisma.chat.findUnique({
          where: { id: chatId },
          select: {
            id: true,
            chatName: true,
            groupChat: true,
          },
        }),
      ]);

      return {
        id,
        sender,
        chat,
        content,
      };
    })
  );

  res.status(200).json({
    message: "Get all messages successful",
    data: transformedMessages,
  });
};

const getAllChatsHandler = async (req: Request, res: Response) => {
  const chats = await prisma.chat.findMany({});

  const transformedChats = await Promise.all(
    chats.map(async ({ id, chatName, members, groupChat, avatar, creator }) => {
      const messagesCount = await prisma.message.count({
        where: {
          chatId: id,
        },
      });
      const totalMembers = await prisma.chat.count({
        where: {
          id,
        },
      });

      return {
        id,
        groupChat,
        chatName,
        creator,
        totalMembers,
        messagesCount,
        avatar,
        members: await Promise.all(
          members.map(async (memberId) => {
            const user = await prisma.user.findUnique({
              where: { id: memberId },
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            });
            return user;
          })
        ),
      };
    })
  );

  res
    .status(200)
    .json({ message: "Get all chats successful", data: transformedChats });
};

const adminVerifyHanlder = async (req: Request, res: Response) => {
  const { secretKey } = req.body;

  if (!secretKey) {
    res.status(400).json({ message: "Secret key is required" });
    return;
  }

  const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

  if (!ADMIN_SECRET_KEY) {
    res.status(500).json({ message: "Admin secret key not set" });
    return;
  }

  if (secretKey !== ADMIN_SECRET_KEY) {
    res.status(401).json({ message: "Invalid secret key" });
    return;
  }

  const token = createAdminToken(true);

  if (!token) {
    res.status(500).json({ message: "Token generation failed" });
    return;
  }

  res
    .status(200)
    .cookie("admin", token, { ...cookieOptions, maxAge: 1000 * 60 * 15 });
};

const adminLogoutHandler = async (req: Request, res: Response) => {
  res
    .status(200)
    .cookie("admin", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logout successful",
    });
};

const statsHandler = async (req: Request, res: Response) => {
  const [usersCount, groupChatsCount, messagesCount, privateChatsCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.chat.count({
        where: {
          groupChat: true,
        },
      }),
      prisma.message.count(),
      prisma.chat.count({
        where: {
          groupChat: false,
        },
      }),
    ]);

  const today = new Date();

  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);

  const lastWeekMessages = await prisma.message.findMany({
    where: {
      createdAt: {
        gte: lastWeek,
        lte: today,
      },
    },
    select: {
      createdAt: true,
    },
  });

  const messages = new Array(7).fill(0);
  [0, 0, 0, 0, 0, 0, 0];
  const dayInMilliseconds = 24 * 60 * 60 * 1000;

  lastWeekMessages.map((message) => {
    const indexApprox =
      (today.getTime() - message.createdAt.getTime()) / dayInMilliseconds;

    const index = Math.floor(indexApprox);
    messages[6 - index]++;
  });

  res.status(200).json({
    message: "Get stats successful",
    data: {
      usersCount,
      groupChatsCount,
      messagesCount,
      privateChatsCount,
    },
  });
};

export {
  GetRequestHandler,
  GetAllUsersHandler,
  getAllMessagesHandler,
  getAllChatsHandler,
  adminVerifyHanlder,
  statsHandler,
  adminLogoutHandler,
};
