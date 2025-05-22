import { NextFunction, Request, Response } from "express";
import {
  signupSchema,
  loginSchema,
  acceptRequestSchema,
} from "../../types/types";
import { prisma } from "../../db";
import {
  compareHashedPassword,
  createToken,
  hashPassword,
} from "../utils/createToken";
import { ErrorHandler } from "../utils/utility";
import { TryCatch } from "../middleware/error";
import { cookieOptions, emitEvent } from "../utils/feature";
import { NEW_REQUEST, REFETCH_CHATS } from "../utils/event";
import { uploadImageToCloudinary } from "../utils/imageUpload";

const signUpHandler = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.bodyyyyyyyyyyyy", req.body);
    const parsedData = await signupSchema.safeParse(req.body);

    console.log("Parsed data", parsedData);

    if (!parsedData.success) {
      console.log("Parsed data error", parsedData.error);
      next(new ErrorHandler("Invalid input data", 400));
      return;
    }

    if (!req.file) {
      next(new ErrorHandler("Avatar is required", 400));
      return;
    }

    const userExists = await prisma.user.findFirst({
      where: {
        email: parsedData.data.email,
      },
    });

    if (userExists) {
      next(new ErrorHandler("userExists with this email", 400));
      return;
    }

    const hashedPassword = await hashPassword(parsedData.data.password);

    console.log("file", req.file);

    const result = await uploadImageToCloudinary(req.file.buffer);
    const data = await JSON.parse(result);
    console.log(data);
    const { url, id } = data;

    const user = await prisma.user.create({
      data: {
        name: parsedData.data.name,
        password: hashedPassword,
        email: parsedData.data.email,
        avatar: url,
        publicId: id,
        bio: parsedData.data.bio,
      },
    });
    console.log("user", user);
    res.status(200).json({
      success: true,
      message: "user created successfully",
      id: user.id,
    });
    return;
  }
);

const loginHandler = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = await loginSchema.safeParse(req.body);

    if (!parsedData.success) {
      next(new ErrorHandler("Invalid input data", 400));
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        name: parsedData.data?.name,
      },
    });

    if (!user) {
      next(
        new ErrorHandler("User not found. Please check your credentials.", 400)
      );
      return;
    }

    const isValid = await compareHashedPassword(
      parsedData.data.password,
      user.password
    );

    if (!isValid) {
      next(new ErrorHandler("Invalid password. Please try again.", 400));
      return;
    }

    const token = await createToken(user.id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
    return;
  }
);

const userDetails = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json({ success: true, user });
  return;
};

const logoutHandler = TryCatch(async (req: Request, res: Response) => {
  res
    .status(200)
    .cookie("access_token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged Out successfully!!",
    });
  return;
});

const searchUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.query;

    const myChats = await prisma.chat.findMany({
      where: {
        groupChat: false,
        members: {
          has: req.userId,
        },
      },
    });

    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

    const allUsersExceptMe = await prisma.user.findMany({
      where: {
        id: {
          notIn: allUsersFromMyChats,
        },
        name: {
          contains: name as string,
          mode: "insensitive",
        },
      },
    });

    res.status(200).json({ success: true, allUsersExceptMe });
    return;
  }
);

const sendFriendRequest = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    const request = await prisma.request.findFirst({
      where: {
        OR: [
          { senderId: req.userId!, receiverId: userId },
          { senderId: userId, receiverId: req.userId! },
        ],
      },
    });

    if (request) {
      next(new ErrorHandler("Request Already Sent", 400));
      return;
    }

    await prisma.request.create({
      data: {
        senderId: req.userId!,
        receiverId: userId,
      },
    });

    emitEvent(req, NEW_REQUEST, [userId]);
    res.status(200).json({ success: true, message: "friend request sent ..." });
    return;
  }
);

const acceptFriendRequest = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = await acceptRequestSchema.safeParse(req.body);
    if (!parsedData.success) {
      next(new ErrorHandler("Invalid input data", 400));
      return;
    }
    const { requestId, accept } = parsedData.data;

    const request = await prisma.request.findFirst({
      where: {
        id: requestId,
      },
    });

    if (!request) {
      next(new ErrorHandler("Request Not Found", 400));
      return;
    }

    const members = [request.senderId, request.receiverId];

    await Promise.all([
      prisma.chat.create({
        data: {
          members,
          groupChat: true,
          chatName: `${request.senderId}-${request.receiverId}`,
        },
      }),
      prisma.request.update({
        where: {
          id: requestId,
        },
        data: {
          status: accept ? "ACCEPTED" : "REJECTED",
        },
      }),
    ]);

    emitEvent(req, REFETCH_CHATS, members);
    res.status(200).json({
      success: true,
      message: `Friend request ${accept ? "accepted" : "rejected"}`,
    });
    return;
  }
);

const getAllNotifications = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const requests = await prisma.request.findMany({
      where: {
        receiverId: req.userId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!requests) {
      next(new ErrorHandler("No requests found", 400));
      return;
    }

    const allRequests = requests.map(({ id, senderId, sender }) => ({
      id,
      sender: {
        id: senderId,
        name: sender.name,
        avatar: sender.avatar,
      },
    }));
    res.status(200).json({ success: true, requests: allRequests });
  }
);

const getMyFriends = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.query.chatId as string;

    const chats = await prisma.chat.findMany({
      where: {
        members: {
          has: req.userId,
        },
        groupChat: false,
      },
      select: {
        members: true,
      },
    });

    if (!chats || chats.length === 0) {
      next(new ErrorHandler("No chats found", 400));
      return;
    }

    const friendsIds = [
      ...new Set(
        chats.flatMap(({ members }) =>
          members.filter((id) => id !== req.userId)
        )
      ),
    ];

    const friends = await prisma.user.findMany({
      where: {
        id: {
          in: friendsIds,
        },
      },
    });

    if (chatId) {
      const chat = await prisma.chat.findFirst({
        where: {
          id: chatId,
        },
      });

      if (!chat) {
        next(new ErrorHandler("Chat not found", 400));
        return;
      }
      const availableFriends = friends.filter(
        (friend) => !chat.members.includes(friend.id)
      );

      res.status(200).json({ success: true, availableFriends });
      return;
    }

    res.status(200).json({ success: true, friends });
    return;
  }
);

export {
  signUpHandler,
  loginHandler,
  userDetails,
  logoutHandler,
  acceptFriendRequest,
  sendFriendRequest,
  searchUser,
  getAllNotifications,
  getMyFriends,
};
