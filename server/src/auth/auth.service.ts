import bcrypt from "bcrypt";
import dotenv from "dotenv";
import createHttpError from "http-errors";
import { sign } from "jsonwebtoken";

import validateEnv from "@/utils/validateEnv";

dotenv.config();
const env = validateEnv();

const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<void> => {
  const match = await bcrypt.compare(password, hashedPassword);

  if (!match) {
    throw createHttpError(401, `Incorrect email and password combination`);
  }
};

const generateAccessToken = (
  email: string,
  name: string,
  expiresIn: string
): string => {
  return sign({ email, name }, env.ACCESS_TOKEN_SECRET, { expiresIn });
};

const generateRefreshToken = (
  email: string,
  name: string,
  expiresIn: string
): string => {
  return sign({ email, name }, env.REFRESH_TOKEN_SECRET, { expiresIn });
};

export const AuthService = {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
};
