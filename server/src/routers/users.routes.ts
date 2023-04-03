import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "@/controllers/users.controller";
import { verifyJWT } from "@/middlewares/verifyJWT";
import { Router } from "express";

const usersRouter = Router();

usersRouter.use(verifyJWT);

usersRouter.route("/").get(getUsers).post(createUser);

usersRouter.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

export default usersRouter;
