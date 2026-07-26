import { Router } from "express";
import { userController } from "./user.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();


router.get(
    "/me",
    protect,
    userController.getMe
);


router.patch(
    "/me",
    protect,
    userController.updateMe
);


// Admin user management

router.get(
    "/",
    protect,
    userController.getAllUsers
);



router.patch(
    "/:id/status",
    protect,
    userController.updateStatus
);


router.patch(
    "/:id/role",
    protect,
    userController.updateRole
);

export const userRouter = router;