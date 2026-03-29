import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get('/', auth(true), userController.getUser);
router.put('/:userId', auth(), userController.updateUser);
// router.delete('/:userId', );

export const userRouter = router;