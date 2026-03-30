import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get('/', auth(true), userController.getUser);
router.put('/:userId', auth(), userController.updateUser);
router.delete('/:userId',auth(true), userController.deleteUser);

export const userRouter = router;