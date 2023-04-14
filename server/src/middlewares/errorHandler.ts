import { type NextFunction,type Request, type Response } from "express";

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

  const status = res.statusCode ?? 500;

  res.status(status);

  res.json({ message: err.message });
};
