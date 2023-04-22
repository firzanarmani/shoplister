import { type Item, type List, type User } from "@prisma/client";
import createHttpError from "http-errors";

import prisma from "@/libs/prisma";

const getLists = async (user: User): Promise<List[]> => {
  const lists = await prisma.list.findMany({
    where: {
      OR: [
        { owner: user },
        {
          users: {
            some: user,
          },
        },
      ],
    },
    include: { owner: true, users: true },
  });

  return lists;
};

const getListById = async (
  user: User,
  id: string
): Promise<List & { owner: User; users: User[]; items: Item[] }> => {
  const list = await prisma.list.findFirst({
    where: {
      id,
      OR: [
        { ownerId: user.id },
        {
          users: {
            some: user,
          },
        },
      ],
    },
    include: { items: true, owner: true, users: true },
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
      owner: {
        connect: { id: user.id },
      },
      name,
    },
    include: {
      owner: true,
      users: true,
    },
  });

  return list;
};

const updateList = async (
  owner: User,
  listId: string,
  name?: string,
  users?: Array<{ email: string }>
): Promise<List> => {
  const list = await ListsService.getListById(owner, listId);

  const addUsers: Array<{ email: string }> = [];
  const removeUsers: Array<{ email: string }> = [];

  users?.forEach((user) => {
    if (
      list.users.filter((existingUser) => existingUser.email === user.email)
        .length === 0
    ) {
      // If userId is not connected (i.e. not in users), connect
      addUsers.push(user);
    } else {
      // If userId is already connected (i.e. in users), disconnect
      removeUsers.push(user);
    }
  });

  const updatedList = await prisma.list.update({
    where: { id: listId },
    data: { name, users: { connect: addUsers, disconnect: removeUsers } },
    include: {
      items: true,
      owner: true,
      users: true,
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
