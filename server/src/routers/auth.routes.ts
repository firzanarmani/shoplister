import { handleLogin } from "@/controllers/auth.controller";
import { Router } from "express";

const authRouter = Router();

authRouter.get("/login", handleLogin);

export default authRouter;
