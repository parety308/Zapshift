import HttpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { userService } from "./user.service.js";

const getMe = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.user_id);
  sendResponse(res, { success: true, statusCode: HttpStatus.OK, message: "Profile fetched", data: user });
});

const updateMe = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.user.user_id, req.body);
  sendResponse(res, { success: true, statusCode: HttpStatus.OK, message: "Profile updated", data: user });
});

export const userController = { getMe, updateMe };
