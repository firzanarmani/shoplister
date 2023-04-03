import {
  createList,
  deleteList,
  getListById,
  getLists,
  updateList,
} from "@/controllers/lists.controller";
import { Router } from "express";

const listRouter = Router();

listRouter.route("/").get(getLists).post(createList);

listRouter.route("/:id").get(getListById).put(updateList).delete(deleteList);

export default listRouter;
