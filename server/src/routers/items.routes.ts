import {
  createItem,
  deleteItem,
  getItemById,
  getItems,
  updateItem,
} from "@/controllers/items.controller";
import { verifyJWT } from "@/middlewares/verifyJWT";
import { Router } from "express";

const itemsRouter = Router();

itemsRouter.use(verifyJWT);

itemsRouter.route("/").get(getItems).post(createItem);

itemsRouter.route("/:id").get(getItemById).put(updateItem).delete(deleteItem);

export default itemsRouter;
