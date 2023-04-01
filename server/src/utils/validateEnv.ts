import { type CleanedEnvAccessors, cleanEnv, port, str, url } from "envalid";
import dotenv from "dotenv";

interface EnvVarTypes {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
}

const validateEnv = (): Readonly<EnvVarTypes & CleanedEnvAccessors> => {
  dotenv.config();

  return cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ["development", "test", "production", "staging"],
    }),
    PORT: port(),
    DATABASE_URL: url(),
  });
};

export default validateEnv;
