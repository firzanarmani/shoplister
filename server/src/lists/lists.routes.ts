import { Router } from "express";

import { ListsController } from "@/lists/lists.controller";
import { verifyJWT } from "@/middlewares/verifyJWT";

const listsRouter = Router();

listsRouter.use(verifyJWT);

listsRouter
  .route("/")
  .get(ListsController.getLists)
  .post(ListsController.createList);

listsRouter
  .route("/:id")
  .get(ListsController.getListById)
  .put(ListsController.updateList)
  .delete(ListsController.deleteList);

export default listsRouter;
