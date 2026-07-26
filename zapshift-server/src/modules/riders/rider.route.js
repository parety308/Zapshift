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
router.get("/active", protect, riderController.activeList);
router.patch("/:id/approve", protect, riderController.approve);
router.delete("/:id", protect, riderController.remove);
router.get(
    "/parcels/unassigned",
    protect,
    riderController.unassignedParcels
);

router.patch(
    "/assign/:parcelId",
    protect,
    riderController.assign
);

router.get(
    "/assigned/:riderId",
    protect,
    riderController.assigned
);
router.get(
  "/me/pending",
  protect,
  riderController.pendingDeliveries
);

router.patch(
  "/parcels/:parcelId/deliver",
  protect,
  riderController.deliverParcel
);

router.get(
  "/me/completed",
  protect,
  riderController.completedDeliveries
);

router.get(
  "/me/earnings",
  protect,
  riderController.myEarnings
);
export const riderRouter = router;
