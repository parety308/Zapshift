import { Router } from "express";
import { paymentController } from "./payment.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/create-checkout-session", protect, paymentController.createCheckoutSession);
router.patch("/payment-success", protect, paymentController.confirmPayment);
router.get("/", protect, paymentController.listMine);

export const paymentRouter = router;
