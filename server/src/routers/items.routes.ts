import {
  createItem,
  deleteItem,
  getItemById,
  getItems,
  updateItem,
} from "@/controllers/items.controller";
import { Router } from "express";

const itemRouter = Router();

itemRouter.route("/").get(getItems).post(createItem);

itemRouter.route("/:id").get(getItemById).put(updateItem).delete(deleteItem);

export default itemRouter;
