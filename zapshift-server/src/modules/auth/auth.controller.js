import HttpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { authService } from "./auth.service.js";

const register = catchAsync(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.CREATED,
    message: "Account created successfully",
    data: { user, token },
  });
});

const login = catchAsync(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Logged in successfully",
    data: { user, token },
  });
});

const me = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user.user_id);
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Current user fetched",
    data: user,
  });
});

export const authController = { register, login, me };
