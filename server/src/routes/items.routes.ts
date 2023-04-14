import { Router } from "express";

import { ItemsController } from "@/controllers/items.controller";
import { verifyJWT } from "@/middlewares/verifyJWT";

const itemsRouter = Router();

itemsRouter.use(verifyJWT);

itemsRouter
  .route("/")
  .get(ItemsController.getItems)
  .post(ItemsController.createItem);

itemsRouter
  .route("/:id")
  .get(ItemsController.getItemById)
  .put(ItemsController.updateItem)
  .delete(ItemsController.deleteItem);

export default itemsRouter;
