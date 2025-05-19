import z from "zod";

export const signupSchema = z.object({
  name: z.string(),
  password: z.string(),
  avatar: z.string(),
  bio: z.string(),
});

export const loginSchema = z.object({
  name: z.string(),
  password: z.string(),
});

export const chatSchema = z.object({
  members: z.array(z.string()).min(2),
  chatName: z.string().optional(),
  avatar: z.string().optional(),
});

export const messageSchema = z.object({
  sender: z.string(),
  content: z.string(),
  receiver: z.string(),
  attachments: z.string(),
});

export const requestSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  status: z.boolean(),
});

export const addMembersSchema = z.object({
  members: z.array(z.string()).min(1),
  chatId: z.string(),
});

export const removeMemberSchema = z.object({
  userId: z.string(),
  chatId: z.string(),
});

export const AttachmentsSchema = z.object({
  chatId: z.string(),
});
