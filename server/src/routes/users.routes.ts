import { Router } from "express";

import { UsersController } from "@/controllers/users.controller";
import { verifyJWT } from "@/middlewares/verifyJWT";

const usersRouter = Router();

usersRouter
  .route("/")
  .get(verifyJWT, UsersController.getUsers)
  .post(UsersController.createUser);

usersRouter
  .route("/:id")
  .get(verifyJWT, UsersController.getUserById)
  .put(verifyJWT, UsersController.updateUser)
  .delete(verifyJWT, UsersController.deleteUser);

export default usersRouter;
