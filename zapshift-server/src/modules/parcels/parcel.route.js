import { Router } from "express";
import { z } from "zod";
import { parcelController } from "./parcel.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

const createParcelSchema = z.object({
  weight: z.coerce.number().positive("Weight must be greater than 0"),
  parcelType: z.enum(["document", "non-document"]),
  senderRegion: z.string().trim().min(1, "Sender region is required"),
  senderDistrict: z.string().trim().min(1, "Sender district is required"),
  receiverRegion: z.string().trim().min(1, "Receiver region is required"),
  receiverDistrict: z.string().trim().min(1, "Receiver district is required"),
});

const router = Router();

router.post("/", protect, validate(createParcelSchema), parcelController.create);
router.get("/", protect, parcelController.listMine);
router.get("/:id", protect, parcelController.getOne);
router.delete("/:id", protect, parcelController.remove);

export const parcelRouter = router;
