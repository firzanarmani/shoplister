import dotenv from "dotenv";
import { type NextFunction, type Request, type Response } from "express";
import jwt, {
  type Jwt,
  type JwtPayload,
  type VerifyCallback,
} from "jsonwebtoken";

import prisma from "@/libs/prisma";
import validateEnv from "@/utils/validateEnv";

dotenv.config();
const env = validateEnv();

export const verifyJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader === undefined) {
    res.send(401).json({ message: "Missing token" });
    return;
  }

  const accessToken = authHeader.split(" ")[1];

  const verifyCallback: VerifyCallback<Jwt> = async (error, decoded) => {
    if (error !== null || decoded === undefined) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const payload = decoded.payload as JwtPayload;

    const foundUser = await prisma.user.findUnique({
      where: {
        email: payload.email as string,
      },
    });

    if (foundUser === null) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.email = foundUser.email;
    req.name = foundUser.name;

    next();
  };

  jwt.verify(
    accessToken,
    env.ACCESS_TOKEN_SECRET,
    { complete: true },
    verifyCallback
  );
};
