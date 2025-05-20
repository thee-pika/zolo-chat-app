import z from "zod";

const signupSchema = z.object({
  name: z.string(),
  password: z.string(),
  avatar: z.string(),
  bio: z.string(),
});

const loginSchema = z.object({
  name: z.string(),
  password: z.string(),
});

const chatSchema = z.object({
  members: z.array(z.string()).min(2),
  chatName: z.string().optional(),
  avatar: z.string().optional(),
});

const messageSchema = z.object({
  sender: z.string(),
  content: z.string(),
  receiver: z.string(),
  attachments: z.string(),
});

const requestSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  status: z.boolean(),
});

const addMembersSchema = z.object({
  members: z.array(z.string()).min(1),
  chatId: z.string(),
});

const removeMemberSchema = z.object({
  userId: z.string(),
  chatId: z.string(),
});

const acceptRequestSchema = z.object({
  requestId: z.string(),
  accept: z.boolean(),
});

const AttachmentsSchema = z.object({
  chatId: z.string(),
});

const updateGroupSchema = z.object({
  creator: z.string().optional(),
  avatar: z.string().optional(),
});

export {
  signupSchema,
  loginSchema,
  chatSchema,
  messageSchema,
  requestSchema,
  addMembersSchema,
  removeMemberSchema,
  acceptRequestSchema,
  AttachmentsSchema,
  updateGroupSchema,
};
