import { Prisma, type User } from "@prisma/client";
import bcrypt from "bcrypt";
import { validate } from "class-validator";
import asyncHandler from "express-async-handler";

import prisma from "@/libs/prisma";
import { CreateUserDto, UpdateUserDto } from "@/users/users.dto";

const getUsers = asyncHandler(async (_req, res, _next) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({ users });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while fetching all available users`,
    });
  }
});

const createUser = asyncHandler(async (req, res, _next) => {
  try {
    const createUserDto = new CreateUserDto();
    createUserDto.email = req.body.email;
    createUserDto.password = req.body.password;
    createUserDto.name = req.body.name;

    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      res.status(400).json({
        constraints: errors.map((error) => ({
          [error.property]: error.constraints,
        })),
      });
      return;
    }

    const foundUser = await prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (foundUser !== null) {
      res.status(409).json({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `Account already exists with the email ${foundUser.email}`,
      });
    }

    const user: User = await prisma.user.create({
      data: {
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, 10),
        name: createUserDto.name,
      },
    });

    res.status(201).json({ user: { email: user.email, name: user.name } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while creating user`,
    });
  }
});

const getUserById = asyncHandler(async (req, res, _next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUniqueOrThrow({ where: { id } });

    res.status(200).json({ user });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while fetching user with ID ${req.params.id}`,
    });
  }
});

const updateUser = asyncHandler(async (req, res, _next) => {
  try {
    const { id } = req.params;
    const foundUser = await prisma.user.findUniqueOrThrow({ where: { id } });

    const updateUserDto = new UpdateUserDto();
    updateUserDto.email = req.body.email;
    updateUserDto.password = req.body.password;
    updateUserDto.name = req.body.name;

    const errors = await validate(updateUserDto);
    if (errors.length > 0) {
      res.status(400).json({
        constraints: errors.map((error) => ({
          [error.property]: error.constraints,
        })),
      });
      return;
    }

    if (updateUserDto.password !== undefined) {
      if (await bcrypt.compare(req.body.password, foundUser.password)) {
        res.status(400).json({ error: "Enter a different password" });
      }
      updateUserDto.password = await bcrypt.hash(req.body.password, 10);
    }

    const user: User = await prisma.user.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        password: updateUserDto.password,
        name: updateUserDto.name,
      },
    });

    res.status(201).json({ user: { email: user.email, name: user.name } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while updating user with ID ${req.params.id}`,
    });
  }
});

const deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundUser = await prisma.user.findUniqueOrThrow({ where: { id } });

    const user = await prisma.user.delete({ where: { id: foundUser.id } });

    res.status(200).json({
      user: { email: user.email, name: user.name },
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      message: `User with email ${user.email} has been deleted`,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while deleting user with ID ${req.params.id}`,
    });
  }
});

export const UsersController = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
