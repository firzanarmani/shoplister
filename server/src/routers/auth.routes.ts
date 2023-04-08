import { AuthController } from "@/controllers/auth.controller";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", AuthController.login);

authRouter.post("/logout", AuthController.logout);

authRouter.get("/refresh", AuthController.refresh);

export default authRouter;
