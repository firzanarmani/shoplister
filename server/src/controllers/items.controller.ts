import { CreateItemDto, UpdateItemDto } from "@/dtos/items.dto";
import prisma from "@/lib/prisma";
import { type Item, Prisma } from "@prisma/client";
import { validate } from "class-validator";
import asyncHandler from "express-async-handler";

export const getItems = asyncHandler(async (_req, res, _next) => {
  try {
    const items = await prisma.item.findMany();

    res.status(200).json({ items });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while fetching all available items`,
    });
  }
});

export const createItem = asyncHandler(async (req, res, _next) => {
  try {
    const createItemDto = new CreateItemDto();
    createItemDto.name = req.body.name;
    createItemDto.details = req.body.details;

    const errors = await validate(createItemDto);
    if (errors.length > 0) {
      res.status(400).json({
        constraints: errors.map((error) => ({
          [error.property]: error.constraints,
        })),
      });
      return;
    }

    const item: Item = await prisma.item.create({
      data: { name: createItemDto.name, details: createItemDto.details },
    });

    res.status(201).json({ item: { name: item.name } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while creating item`,
    });
  }
});

export const getItemById = asyncHandler(async (req, res, _next) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({ where: { id } });

    res.status(200).json({ item });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while fetching item with ID ${req.params.id}`,
    });
  }
});

export const updateItem = asyncHandler(async (req, res, _next) => {
  try {
    const updateItemDto = new UpdateItemDto();
    updateItemDto.id = req.body.id;
    updateItemDto.name = req.body.name;
    updateItemDto.details = req.body.details;

    const errors = await validate(updateItemDto);
    if (errors.length > 0) {
      res.status(400).json({
        constraints: errors.map((error) => ({
          [error.property]: error.constraints,
        })),
      });
      return;
    }

    const item: Item = await prisma.item.update({
      where: { id: updateItemDto.id },
      data: { name: updateItemDto.name, details: updateItemDto.details },
    });

    res.status(201).json({ item: { name: item.name } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while updating item with ID ${req.params.id}`,
    });
  }
});

export const deleteItem = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.delete({ where: { id } });

    res.status(200).json({ item });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: `${e.message} (${e.code})` });
    }
    res.status(500).json({
      error: `Unexpected error while deleting item with ID ${req.params.id}`,
    });
  }
});
