import dotenv from "dotenv";
import validateEnv from "@/utils/validateEnv";
import jwt, {
  type Jwt,
  type JwtPayload,
  type VerifyCallback,
} from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { LoginDto } from "@/dtos/auth.dto";
import { validate } from "class-validator";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

dotenv.config();
const env = validateEnv();

export const login = asyncHandler(async (req, res) => {
  const loginDto = new LoginDto();
  loginDto.email = req.body.email;
  loginDto.password = req.body.password;

  const errors = await validate(loginDto);
  if (errors.length > 0) {
    res.status(400).json({
      constraints: errors.map((error) => ({
        [error.property]: error.constraints,
      })),
    });
    return;
  }

  const foundUser = await prisma.user.findUnique({
    where: { email: loginDto.email },
  });

  if (foundUser === null) {
    res.status(401).json({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      message: `Account does not exist with email ${loginDto.email}`,
    });
    return;
  }

  const match = await bcrypt.compare(loginDto.password, foundUser.password);

  if (!match) {
    res.status(401).json({ message: "Incorrect email/password" });
    return;
  }

  const accessToken = jwt.sign(
    { email: foundUser.email, name: foundUser.name },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    { email: foundUser.email, name: foundUser.name },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (cookies !== undefined && cookies.jwt === undefined) {
    res.sendStatus(204);
    return;
  }
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: env.isProduction,
  });
  res.json({ message: "Logged out" });
});

export const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (
    cookies === undefined ||
    (cookies !== undefined && cookies.jwt === undefined)
  ) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const refreshToken = cookies.jwt;

  const verifyCallback: VerifyCallback<Jwt> = async (error, decoded) => {
    if (error !== null || decoded === undefined) {
      res.status(403).json({ message: "Forbidden" });
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

    const accessToken = jwt.sign(
      { email: foundUser.email, name: foundUser.name },
      env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.json({ accessToken });
  };

  jwt.verify(
    refreshToken,
    env.REFRESH_TOKEN_SECRET,
    { complete: true },
    verifyCallback
  );
});
