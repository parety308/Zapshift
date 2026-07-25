import { Router } from "express";
import { riderController } from "./rider.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { z } from "zod";

const applySchema = z.object({
  vehicleType: z.string().trim().min(2, "Vehicle type is required"),
  division: z.string().trim().min(1, "Region is required"),
  district: z.string().trim().min(1, "District is required"),
});

const router = Router();

router.post("/apply", protect, validate(applySchema), riderController.apply);
router.get("/me", protect, riderController.getMine);
router.get("/", protect, riderController.list);

export const riderRouter = router;
