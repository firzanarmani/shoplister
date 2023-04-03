import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import validateEnv from "@/utils/validateEnv";
import authRouter from "@/routers/auth.routes";
import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import listsRouter from "./routers/lists.routes";
import itemsRouter from "./routers/items.routes";
import usersRouter from "./routers/users.routes";
import cookieParser from "cookie-parser";

dotenv.config();

const env = validateEnv();
const PORT = env.PORT;

const app = express();

app.use(logger);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/v1/auth", authRouter);
app.use("/v1/lists", listsRouter);
app.use("/v1/items", itemsRouter);
app.use("/v1/users", usersRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
