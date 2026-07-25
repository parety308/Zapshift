import HttpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { regionService } from "./region.service.js";

const getRegions = catchAsync(async (req, res) => {
  const regions = await regionService.listRegions();
  sendResponse(res, { success: true, statusCode: HttpStatus.OK, message: "Regions fetched", data: regions });
});

export const regionController = { getRegions };
