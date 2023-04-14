import { Router } from "express";

import { AuthController } from "@/auth/auth.controller";
import { LoginSchema, RegisterSchema } from "@/auth/auth.schema";
import { validate } from "@/middlewares/validate";

const authRouter = Router();

authRouter
  .route("/register")
  .post(validate(RegisterSchema), AuthController.register);

authRouter.route("/login").post(validate(LoginSchema), AuthController.login);

authRouter.route("/logout").post(AuthController.logout);

authRouter.route("/refresh").get(AuthController.refresh);

export default authRouter;
