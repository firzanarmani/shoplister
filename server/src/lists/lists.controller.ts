import { type List, Prisma } from "@prisma/client";
import { validate } from "class-validator";
import asyncHandler from "express-async-handler";

import prisma from "@/libs/prisma";
import {
  CreateListDto,
  DeleteListDto,
  GetListDto,
  GetListsDto,
  UpdateListDto,
} from "@/lists/lists.dto";

const getLists = asyncHandler(async (req, res, _next) => {
  try {
    const getListsDto = new GetListsDto();
    getListsDto.email = req.email; // req.email after verifyJWT

    const errors = await validate(getListsDto);
    if (errors.length > 0) {
      res.status(400).json({
        constraints: errors.map((error) => ({
          [error.property]: error.constraints,
        })),
      });
      return;
    }

    const lists = await prisma.list.findMany({
      where: {
        user: {
          email: getListsDto.email,
        },
      },
      include: {
        items: true,
      },
    });

    res.status(200).json({ lists });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while fetching all available lists`,
    });
  }
});

const getListById = asyncHandler(async (req, res, _next) => {
  try {
    const getListDto = new GetListDto();
    getListDto.email = req.email;
    getListDto.id = req.params.id;

    const errors = await validate(getListDto);
    if (errors.length > 0) {
      res.status(400).json({
        constraints: errors.map((error) => ({
          [error.property]: error.constraints,
        })),
      });
      return;
    }

    const list = await prisma.list.findFirstOrThrow({
      where: { id: getListDto.id, user: { email: getListDto.email } },
      include: { items: true },
    });

    res.status(200).json({ list });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
      return;
    }
    res.status(500).json({
      error: `Unexpected error while fetching list with ID ${req.params.id}`,
    });
  }
});

const createList = asyncHandler(async (req, res, _next) => {
  try {
    const createListDto = new CreateListDto();
    createListDto.email = req.email;
    createListDto.name = req.body.name;

    const errors = await validate(createListDto);
    if (errors.length > 0) {
      res.status(400).json({
        constraints: errors.map((error) => ({
          [error.property]: error.constraints,
        })),
      });
      return;
    }

    const foundUser = await prisma.user.findUniqueOrThrow({
      where: {
        email: createListDto.email,
      },
    });

    const list = await prisma.list.create({
      data: {
        userId: foundUser.id,
        name: createListDto.name,
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({ list });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while creating list`,
    });
  }
});

const updateList = asyncHandler(async (req, res, _next) => {
  try {
    const updateListDto = new UpdateListDto();
    updateListDto.id = req.params.id;
    updateListDto.name = req.body.name;

    const errors = await validate(updateListDto);
    if (errors.length > 0) {
      res.status(400).json({
        constraints: errors.map((error) => ({
          [error.property]: error.constraints,
        })),
      });
      return;
    }

    const list: List = await prisma.list.update({
      where: { id: updateListDto.id },
      data: { name: updateListDto.name },
      include: {
        items: true,
      },
    });

    res.status(201).json({ list });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while updating list with ID ${req.params.id}`,
    });
  }
});

const deleteList = asyncHandler(async (req, res, next) => {
  try {
    const deleteListDto = new DeleteListDto();
    deleteListDto.id = req.params.id;

    const errors = await validate(DeleteListDto);
    if (errors.length > 0) {
      res.status(400).json({
        constraints: errors.map((error) => ({
          [error.property]: error.constraints,
        })),
      });
      return;
    }

    const list = await prisma.list.delete({ where: { id: deleteListDto.id } });

    res.status(200).json({ list });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while deleting list with ID ${req.params.id}`,
    });
  }
});

export const ListsController = {
  getLists,
  getListById,
  createList,
  updateList,
  deleteList,
};
