import z from "zod";

export const user = z.object({
  name: z.string(),
  password: z.string(),
  avatar: z.string(),
  bio: z.string(),
});

export const chat = z.object({
  groupChat: z.boolean(),
  creator: z.string().optional(),
  members: z.array(z.string()),
  chatName: z.string().optional(),
  avatar: z.string().optional(),
});

export const message = z.object({
  sender: z.string(),
  content: z.string(),
  receiver: z.string(),
  attachments: z.string(),
});

export const request = z.object({
    senderId: z.string(),
    receiverId: z.string(),
    status: z.boolean()
})

