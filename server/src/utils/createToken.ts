import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "dotenv";
config();

export const createToken = async (userId: string) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return;
  }
  const token = await jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
  return token;
};

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const compareHashedPassword = async (
  password: string,
  hashedPassword: string
) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};

