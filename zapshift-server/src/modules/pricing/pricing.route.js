import { Router } from "express";
import { pricingController } from "./pricing.controller.js";

const router = Router();

router.get("/", pricingController.getPricingRules);

export const pricingRouter = router;
