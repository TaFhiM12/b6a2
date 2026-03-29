import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post('/signup', authController.userRegister);
router.post('/signin', authController.userLogin);

export const authRouter = router;