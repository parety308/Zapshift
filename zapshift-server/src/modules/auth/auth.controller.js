import { success } from "zod";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import HttpsStatus from 'http-status-codes'
import { authService } from "./auth.service.js";
const registerUser = catchAsync(async (req, resizeBy, next) => {
    const result = await authService.regsterUserDB(req.body);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.CREATED,
        message: "User Resgistered Successfully",
        data: result
    });
});

export const authController = { registerUser };