import {
  createList,
  deleteList,
  getListById,
  getLists,
  updateList,
} from "@/controllers/lists.controller";
import { verifyJWT } from "@/middlewares/verifyJWT";
import { Router } from "express";

const listsRouter = Router();

listsRouter.use(verifyJWT);

listsRouter.route("/").get(getLists).post(createList);

listsRouter.route("/:id").get(getListById).put(updateList).delete(deleteList);

export default listsRouter;
