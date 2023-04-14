import { type NextFunction, type Request, type Response } from "express";
import { HttpError } from "http-errors";

import { logEvents } from "./logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  void logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${
      req.headers.origin ?? ""
    }`,
    "errLog.log"
  );

  console.log(err.stack);

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: err.message });
};
