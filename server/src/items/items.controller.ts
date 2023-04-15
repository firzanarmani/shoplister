import asyncHandler from "express-async-handler";

import {
  type CreateItemBody,
  type DeleteItemBody,
  type DeleteItemParams,
  type UpdateItemBody,
  type UpdateItemParams,
} from "@/items/items.schema";
import { ItemsService } from "@/items/items.service";
import { ListsService } from "@/lists/lists.service";
import { UsersService } from "@/users/users.service";

const createItem = asyncHandler<unknown, unknown, CreateItemBody>(
  async (req, res, next) => {
    try {
      const user = await UsersService.findUserByEmail(req.email);

      const list = await ListsService.getListById(user, req.body.listId);

      const item = await ItemsService.createItem(
        list,
        req.body.name,
        req.body.details
      );

      res.status(201).json({ item });
    } catch (error) {
      next(error);
    }
  }
);

const updateItem = asyncHandler<UpdateItemParams, unknown, UpdateItemBody>(
  async (req, res, next) => {
    try {
      const user = await UsersService.findUserByEmail(req.email);

      const list = await ListsService.getListById(user, req.body.listId);

      const item = await ItemsService.getItemById(user, list, req.params.id);

      // TODO Allow user to move an item to another list
      const updatedItem = await ItemsService.updateItem(
        item,
        req.body.name,
        req.body.details
      );

      res.status(201).json({ updatedItem });
    } catch (error) {
      next(error);
    }
  }
);

const deleteItem = asyncHandler<DeleteItemParams, unknown, DeleteItemBody>(
  async (req, res, next) => {
    try {
      const user = await UsersService.findUserByEmail(req.email);

      const list = await ListsService.getListById(user, req.body.listId);

      const item = await ItemsService.getItemById(user, list, req.params.id);

      const deletedItem = await ItemsService.deleteItem(item);

      res.status(200).json({ deletedItem });
    } catch (error) {
      next(error);
    }
  }
);

export const ItemsController = {
  createItem,
  updateItem,
  deleteItem,
};
