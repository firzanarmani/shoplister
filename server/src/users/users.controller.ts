import asyncHandler from "express-async-handler";

import { type GetUserParams } from "./users.schema";
import { UsersService } from "./users.service";

const getUser = asyncHandler<GetUserParams>(async (req, res, next) => {
  try {
    // Ensure that only users can search for another user
    await UsersService.findUserByEmail(req.email);

    console.log(req.params.email);

    // Search and return the user
    const user = await UsersService.findUserByEmail(req.params.email);

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});

export const UsersController = {
  getUser,
};
