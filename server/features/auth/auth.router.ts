import { Router } from "express";
import { register, login, logout, verifyEmail, forgetPassword, resetPassword } from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.post("/forget-password", forgetPassword);
router.patch("/reset-password", resetPassword);

export default router;