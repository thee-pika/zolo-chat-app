import { Request } from "express";

const cookieOptions = {
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const emitEvent = (
  req: Request,
  event: string,
  users: string[],
  data?: unknown
) => {
  console.log("Emitting event", event);
};

const deleteFilesFromCloudinary = async (public_ids: string[]) => {
  console.log(public_ids);
};

export { cookieOptions, emitEvent, deleteFilesFromCloudinary };
