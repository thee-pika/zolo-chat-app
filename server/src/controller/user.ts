import { NextFunction, Request, Response } from "express";
import { signupSchema, loginSchema } from "../../types/types";
import { prisma } from "../../db";
import {
  compareHashedPassword,
  createToken,
  hashPassword,
} from "../utils/createToken";
import { ErrorHandler } from "../utils/utility";
import { TryCatch } from "../middleware/error";
import { cookieOptions, emitEvent } from "../utils/feature";
import { NEW_REQUEST } from "../utils/event";

const signUpHandler = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = await signupSchema.safeParse(req.body);

    if (!parsedData.success) {
      next(new ErrorHandler("Invalid input data", 400));
      return;
    }

    const hashedPassword = await hashPassword(parsedData.data.password);

    const user = await prisma.user.create({
      data: {
        name: parsedData.data.name,
        password: hashedPassword,
        avatar: parsedData.data.avatar,
        bio: parsedData.data.bio,
      },
    });

    res.status(200).json({ message: "user created successfully", id: user.id });
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
      message: "Login successful",
      token,
    });
    return;
  }
);

const userDetails = (req: Request, res: Response) => {};

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

export { signUpHandler, loginHandler, userDetails, logoutHandler };
