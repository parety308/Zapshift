import HttpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { paymentService } from "./payment.service.js";

const createCheckoutSession = catchAsync(async (req, res) => {
  const { parcelId } = req.body;
  const result = await paymentService.createCheckoutSession(req.user.user_id, parcelId);
  sendResponse(res, { success: true, statusCode: HttpStatus.OK, message: "Checkout session created", data: result });
});

const confirmPayment = catchAsync(async (req, res) => {
  const result = await paymentService.confirmPayment(req.query.session_id);
  sendResponse(res, { success: true, statusCode: HttpStatus.OK, message: "Payment confirmed", data: result });
});

const listMine = catchAsync(async (req, res) => {
  const payments = await paymentService.listPaymentsForUser(req.user.user_id);
  sendResponse(res, { success: true, statusCode: HttpStatus.OK, message: "Payments fetched", data: payments });
});

export const paymentController = { createCheckoutSession, confirmPayment, listMine };
