import dotenv from "dotenv";
import { type CleanedEnvAccessors, cleanEnv, port, str, url } from "envalid";

interface EnvVarTypes {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  BOT_TOKEN: string;
}

const validateEnv = (): Readonly<EnvVarTypes & CleanedEnvAccessors> => {
  dotenv.config();

  return cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ["development", "test", "production", "staging"],
    }),
    PORT: port(),
    DATABASE_URL: url(),
    ACCESS_TOKEN_SECRET: str(),
    REFRESH_TOKEN_SECRET: str(),
    BOT_TOKEN: str(),
  });
};

export default validateEnv;
