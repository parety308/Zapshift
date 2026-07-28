import { Router } from "express";
import { riderController } from "./rider.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { z } from "zod";

const router = Router();

const applySchema = z.object({
    vehicleType: z.string().trim().min(2),
    division: z.string().trim().min(1),
    district: z.string().trim().min(1),
});

/*
|--------------------------------------------------------------------------
| Rider Application
|--------------------------------------------------------------------------
*/

router.post(
    "/apply",
    protect,
    validate(applySchema),
    riderController.apply
);

router.get(
    "/me",
    protect,
    riderController.getMine
);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    protect,
    adminOnly,
    riderController.list
);

router.get(
    "/applications/pending",
    protect,
    riderController.pendingApplications
);
router.get(
    "/active",
    protect,
    adminOnly,
    riderController.activeList
);

router.patch(
    "/:id/approve",
    protect,
    adminOnly,
    riderController.approve
);

router.delete(
    "/:id",
    protect,
    adminOnly,
    riderController.remove
);

/*
|--------------------------------------------------------------------------
| Parcel Assignment
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Rider Dashboard
|--------------------------------------------------------------------------
*/

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