import HttpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { riderService } from "./rider.service.js";

const apply = catchAsync(async (req, res) => {
  const rider = await riderService.applyAsRider(req.user.user_id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.CREATED,
    message: "Rider application submitted",
    data: rider,
  });
});

const getMine = catchAsync(async (req, res) => {
  const rider = await riderService.getRiderByUserId(req.user.user_id);
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: rider ? "Rider profile fetched" : "No rider application on file",
    data: rider,
  });
});

const list = catchAsync(async (req, res) => {
  const riders = await riderService.listRiders();
  sendResponse(res, { success: true, statusCode: HttpStatus.OK, message: "Riders fetched", data: riders });
});

export const riderController = { apply, getMine, list };
