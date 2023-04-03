import jwt, { type JwtPayload, type VerifyCallback } from "jsonwebtoken";
import dotenv from "dotenv";
import { type NextFunction, type Request, type Response } from "express";
import validateEnv from "@/utils/validateEnv";
import prisma from "@/lib/prisma";

dotenv.config();
const env = validateEnv();

export const verifyJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (authHeader === undefined) {
    res.sendStatus(401);
    return;
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err !== null) {
      res.sendStatus(403);
      return;
    }

    const verifyCallback: VerifyCallback<JwtPayload> = async (
      error,
      decoded
    ) => {
      if (error !== null || decoded === undefined) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      const foundUser = await prisma.user.findUnique({
        where: {
          email: decoded.email,
        },
      });

      if (foundUser === null) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      req.email = decoded.email;
      req.name = decoded.name;
    };

    jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET,
      { complete: true },
      verifyCallback
    );

    next();
  });
};
