import { type NextFunction, type Request, type Response } from "express";
import createError from "http-errors";
import { type AnyZodObject, ZodError, type ZodOptional } from "zod";
import { fromZodError } from "zod-validation-error";

export const validate =
  (schema: AnyZodObject | ZodOptional<AnyZodObject>) =>
  async (req: Request<unknown>, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(createError(409, fromZodError(error)));
      }

      next(createError(400, { error }));
    }
  };
