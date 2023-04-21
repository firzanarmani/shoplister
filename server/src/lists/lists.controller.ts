import asyncHandler from "express-async-handler";

import {
  type CreateListBody,
  type DeleteListParams,
  type GetListParams,
  type UpdateListBody,
  type UpdateListParams,
} from "@/lists/lists.schema";
import { ListsService } from "@/lists/lists.service";
import { UsersService } from "@/users/users.service";

const getLists = asyncHandler<unknown, unknown>(async (req, res, next) => {
  try {
    const user = await UsersService.findUserByEmail(req.email);

    const lists = await ListsService.getLists(user);

    res.status(200).json({ lists });
  } catch (error) {
    next(error);
  }
});

const getListById = asyncHandler<GetListParams>(async (req, res, next) => {
  try {
    const user = await UsersService.findUserByEmail(req.email);

    const list = await ListsService.getListById(user, req.params.id);

    res.status(200).json({ list });
  } catch (error) {
    next(error);
  }
});

const createList = asyncHandler<unknown, unknown, CreateListBody>(
  async (req, res, next) => {
    try {
      const user = await UsersService.findUserByEmail(req.email);

      const list = await ListsService.createList(user, req.body.name);

      res.status(201).json({ list });
    } catch (error) {
      next(error);
    }
  }
);

const updateList = asyncHandler<UpdateListParams, unknown, UpdateListBody>(
  async (req, res, next) => {
    try {
      // Check that the user is valid
      const user = await UsersService.findUserByEmail(req.email);

      // Check that a list exists and the user is the owner of the list
      // (only the owner can change the list name and members)
      await ListsService.getListById(user, req.params.id);

      if (req.body.userEmails !== undefined) {
        await Promise.all(
          req.body.userEmails.map(async (user) => {
            await UsersService.findUserByEmail(user.email);
          })
        );
      }

      // Update the list
      const updatedList = await ListsService.updateList(
        user,
        req.params.id,
        req.body.name,
        req.body.userEmails
      );

      res.status(200).json({ updatedList });
    } catch (error) {
      next(error);
    }
  }
);

const deleteList = asyncHandler<DeleteListParams>(async (req, res, next) => {
  try {
    const user = await UsersService.findUserByEmail(req.email);

    const list = await ListsService.getListById(user, req.params.id);

    const deletedList = await ListsService.deleteList(list);

    res.status(200).json({ deletedList });
  } catch (error) {
    next(error);
  }
});

export const ListsController = {
  getLists,
  getListById,
  createList,
  updateList,
  deleteList,
};
