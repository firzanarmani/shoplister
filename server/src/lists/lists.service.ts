import { type List, type User } from "@prisma/client";
import createHttpError from "http-errors";

import prisma from "@/libs/prisma";

const getLists = async (user: User): Promise<List[]> => {
  const lists = await prisma.list.findMany({
    where: {
      user,
    },
    include: { items: true },
  });

  return lists;
};

const getListById = async (user: User, id: string): Promise<List> => {
  const list = await prisma.list.findFirst({
    where: {
      id,
      user,
    },
    include: { items: true },
  });

  if (list === null) {
    throw createHttpError(
      400,
      `List with specified ID does not exist or specified user does not have access to this list`
    );
  }

  return list;
};

const createList = async (user: User, name: string): Promise<List> => {
  const list = await prisma.list.create({
    data: {
      user: {
        connect: { id: user.id },
      },
      name,
    },
    include: {
      items: true,
    },
  });

  return list;
};

const updateList = async (list: List, name?: string): Promise<List> => {
  const updatedList = await prisma.list.update({
    where: { id: list.id },
    data: { name },
    include: {
      items: true,
    },
  });

  return updatedList;
};

const deleteList = async (list: List): Promise<List> => {
  const deletedList = await prisma.list.delete({
    where: { id: list.id },
  });

  return deletedList;
};

export const ListsService = {
  getLists,
  getListById,
  createList,
  updateList,
  deleteList,
};
