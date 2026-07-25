import { Router } from "express";
import { regionController } from "./region.controller.js";

const router = Router();

router.get("/", regionController.getRegions);

export const regionRouter = router;