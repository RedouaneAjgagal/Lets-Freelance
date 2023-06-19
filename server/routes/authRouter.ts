import { Router } from "express";
import { register, login, logout, forgetPassword, resetPassword } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forget-password", forgetPassword);
router.patch("/reset-password", resetPassword);




export default router;