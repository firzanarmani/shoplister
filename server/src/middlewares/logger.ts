import { randomUUID } from "crypto";
import { format } from "date-fns";
import { type NextFunction, type Request, type Response } from "express";
import fs from "fs";
import path from "path";

export const logEvents = async (
  message: string,
  logFileName: string
): Promise<void> => {
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  const logItem = `${dateTime}\t${randomUUID()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fs.promises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fs.promises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

export const logger = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  void logEvents(
    `${req.method}\t${req.url}\t${req.headers.origin ?? ""}`,
    "reqLog.log"
  );
  console.log(`${req.method} ${req.path}`);
  next();
};
