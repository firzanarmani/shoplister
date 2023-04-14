import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import jwt, {
  type Jwt,
  type JwtPayload,
  type VerifyCallback,
} from "jsonwebtoken";

import { AuthService } from "@/auth/auth.service";
import prisma from "@/libs/prisma";
import { UsersService } from "@/users/users.service";
import validateEnv from "@/utils/validateEnv";

dotenv.config();
const env = validateEnv();

const register = asyncHandler(async (req, res, next) => {
  try {
    const createdUser = await UsersService.createUser(req.body);

    res
      .status(201)
      .json({ user: { email: createdUser.email, name: createdUser.name } });
  } catch (error) {
    next(error);
  }
});

const login = asyncHandler(async (req, res, next) => {
  try {
    const user = await UsersService.findUserByEmail(req.body.email);

    await AuthService.comparePassword(req.body.password, user.password);

    const accessToken = AuthService.generateAccessToken(
      user.email,
      user.name,
      "15m"
    );

    const refreshToken = AuthService.generateRefreshToken(
      user.email,
      user.name,
      "7d"
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: env.isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
});

const logout = asyncHandler(async (req, res, next) => {
  const cookies = req.cookies;

  if (cookies !== undefined && cookies.jwt === undefined) {
    res.status(204).json({ message: "Missing cookies" });
    return;
  }

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: env.isProduction,
  });

  res.json({ message: "Logged out" });
});

const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (
    cookies === undefined ||
    (cookies !== undefined && cookies.jwt === undefined)
  ) {
    res.status(401).json({ message: "Missing token" });
    return;
  }

  const refreshToken = cookies.jwt;

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

export const AuthController = { register, login, logout, refresh };
