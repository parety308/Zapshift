import { Router } from "express";
import { userController } from "./user.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", protect, userController.getMe);
router.patch("/me", protect, userController.updateMe);

export const userRouter = router;
