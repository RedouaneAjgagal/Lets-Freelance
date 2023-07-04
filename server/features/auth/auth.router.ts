import { Router } from "express";
import { register, login, logout, verifyEmail, forgetPassword, resetPassword, userInfo } from "./auth.controller";
import authentication from "../../middlewares/authentication";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/verify-email", verifyEmail);
router.post("/forget-password", forgetPassword);
router.patch("/reset-password", resetPassword);
router.get("/current-user", authentication, userInfo);

export default router;