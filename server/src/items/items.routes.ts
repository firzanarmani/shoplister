import { Router } from "express";

import { ItemsController } from "@/items/items.controller";
import { verifyJWT } from "@/middlewares/verifyJWT";

const itemsRouter = Router();

itemsRouter.use(verifyJWT);

itemsRouter.route("/").post(ItemsController.createItem);

itemsRouter
  .route("/:id")
  .put(ItemsController.updateItem)
  .delete(ItemsController.deleteItem);

export default itemsRouter;
