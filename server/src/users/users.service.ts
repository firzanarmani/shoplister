import { type User } from "@prisma/client";
import { hash } from "bcrypt";
import createHttpError from "http-errors";

import { type Register } from "@/auth/auth.schema";
import prisma from "@/libs/prisma";

const findUserByEmail = async (email: string): Promise<User> => {
  const foundUser = await prisma.user.findUnique({
    where: { email },
  });

  if (foundUser === null) {
    throw createHttpError(401, `Account with specified email does not exist`);
  }

  return foundUser;
};

const createUser = async ({
  email,
  name,
  password,
}: Register): Promise<User> => {
  const foundUser = await prisma.user.findUnique({
    where: { email },
  });

  if (foundUser !== null) {
    throw createHttpError(409, `Account with specified email already exists`);
  }

  const hashedPassword = await hash(password, 10);

  const createdUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return createdUser;
};

export const UsersService = {
  findUserByEmail,
  createUser,
};
