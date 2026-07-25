import HttpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { pricingService } from "./pricing.service.js";

const getPricingRules = catchAsync(async (req, res) => {
  const rules = await pricingService.listPricingRules();
  sendResponse(res, { success: true, statusCode: HttpStatus.OK, message: "Pricing rules fetched", data: rules });
});

export const pricingController = { getPricingRules };
