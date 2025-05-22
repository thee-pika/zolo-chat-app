import { Request } from "express";
import { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions: CookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  httpOnly: true,
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
