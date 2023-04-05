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

usersRouter.route("/").get(verifyJWT, getUsers).post(createUser);

usersRouter
  .route("/:id")
  .get(verifyJWT, getUserById)
  .put(verifyJWT, updateUser)
  .delete(verifyJWT, deleteUser);

export default usersRouter;
