import { Router } from "express";

import { verifyJWT } from "@/middlewares/verifyJWT";
import { UsersController } from "@/users/users.controller";

const usersRouter = Router();

usersRouter.use(verifyJWT);

usersRouter.route("/:email").get(UsersController.getUser);

export default usersRouter;
