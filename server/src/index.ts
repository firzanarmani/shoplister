import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import validateEnv from "@/utils/validateEnv";

dotenv.config();

const env = validateEnv();
const PORT = env.PORT;

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
