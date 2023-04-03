import { CreateListDto, UpdateListDto } from "@/dtos/lists.dto";
import prisma from "@/lib/prisma";
import { type List, Prisma } from "@prisma/client";
import { validate } from "class-validator";
import asyncHandler from "express-async-handler";

export const getLists = asyncHandler(async (_req, res, _next) => {
  try {
    const lists = await prisma.list.findMany();

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

export const createList = asyncHandler(async (req, res, _next) => {
  try {
    const createListDto = new CreateListDto();
    createListDto.userId = req.body.userId;
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

    const list: List = await prisma.list.create({
      data: { userId: createListDto.userId, name: createListDto.name },
    });

    res.status(201).json({ list: { name: list.name } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while creating list`,
    });
  }
});

export const getListById = asyncHandler(async (req, res, _next) => {
  try {
    const { id } = req.params;
    const list = await prisma.list.findUnique({ where: { id } });

    res.status(200).json({ list });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while fetching list with ID ${req.params.id}`,
    });
  }
});

// TODO Do we want to allow changing user?
export const updateList = asyncHandler(async (req, res, _next) => {
  try {
    const updateListDto = new UpdateListDto();
    updateListDto.id = req.body.id;
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
    });

    res.status(201).json({ list: { name: list.name } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while updating list with ID ${req.params.id}`,
    });
  }
});

export const deleteList = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const list = await prisma.list.delete({ where: { id } });

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
