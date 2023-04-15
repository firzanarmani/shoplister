import { type Item, type List, type User } from "@prisma/client";
import createHttpError from "http-errors";

import prisma from "@/libs/prisma";

const getItemById = async (
  user: User,
  list: List,
  id: string
): Promise<Item> => {
  // TODO Write tests to confirm that user and list is not needed here
  const item = await prisma.item.findFirst({
    where: {
      id,
      listId: list.id,
    },
  });

  if (item === null) {
    throw createHttpError(
      400,
      `Item with specified ID does not exist or specified user does not access to this list`
    );
  }

  return item;
};

const createItem = async (
  list: List,
  name: string,
  details?: string
): Promise<Item> => {
  const item = await prisma.item.create({
    data: {
      List: {
        connect: { id: list.id },
      },
      name,
      details,
    },
  });

  return item;
};

const updateItem = async (
  item: Item,
  name?: string,
  details?: string
): Promise<Item> => {
  const newItem = await prisma.item.update({
    where: { id: item.id },
    data: { name, details },
  });

  return newItem;
};

const deleteItem = async (item: Item): Promise<Item> => {
  const deletedItem = await prisma.item.delete({
    where: {
      id: item.id,
    },
  });

  return deletedItem;
};

export const ItemsService = { getItemById, createItem, updateItem, deleteItem };
