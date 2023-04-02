import dotenv from "dotenv";
import validateEnv from "@/utils/validateEnv";
import { AuthDataValidator, urlStrToAuthDataMap } from "@telegram-auth/server";
import { type RequestHandler } from "express";

dotenv.config();
const env = validateEnv();

export const handleLogin: RequestHandler = async (req, res) => {
  const validator = new AuthDataValidator({ botToken: env.BOT_TOKEN });
  const data = urlStrToAuthDataMap(req.url);

  try {
    const user = await validator.validate(data);
    console.log(user);
  } catch (error) {}

  return res.status(200).send();
};
