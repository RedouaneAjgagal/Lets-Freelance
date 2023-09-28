import { Router } from "express";
import { register, login, logout, verifyEmail, changeEmail, resetEmail, forgetPassword, resetPassword, createStripeConnect, getBankAccounts, addExternalBankAccounts, removeBankInfo, userInfo } from "./auth.controller";
import authentication from "../../middlewares/authentication";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/verify-email", verifyEmail);
router.get("/change-email", authentication, changeEmail);
router.post("/reset-email", authentication, resetEmail);
router.post("/forget-password", forgetPassword);
router.patch("/reset-password", resetPassword);
router.post("/set-payment-method", authentication, createStripeConnect);
router.get("/set-payment-method", authentication, getBankAccounts);
router.patch("/set-payment-method", authentication, addExternalBankAccounts);
router.delete("/set-payment-method/:bankInfoId", authentication, removeBankInfo);
router.get("/current-user", authentication, userInfo);

export default router;