import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";

import authRouter from "@/auth/auth.routes";
import itemsRouter from "@/items/items.routes";
import listsRouter from "@/lists/lists.routes";
import { errorHandler } from "@/middlewares/errorHandler";
import { logger } from "@/middlewares/logger";
import validateEnv from "@/utils/validateEnv";

dotenv.config();

const env = validateEnv();
const PORT = env.PORT;

const app = express();

app.use(logger);

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/v1/auth", authRouter);
app.use("/v1/lists", listsRouter);
app.use("/v1/items", itemsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
