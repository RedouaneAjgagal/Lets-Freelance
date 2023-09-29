import { Router } from "express";
import { register, login, logout, verifyEmail, changeEmail, resetEmail, forgetPassword, resetPassword, createBankAccount, getBankAccounts, addExternalBankAccounts, removeExternalBankAccount, deleteStripeConnectedBankAccount, userInfo } from "./auth.controller";
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
router.get("/current-user", authentication, userInfo);

router.route("/bank-account")
    .get(authentication, getBankAccounts)
    .post(authentication, createBankAccount)
    .patch(authentication, addExternalBankAccounts)
    .delete(authentication, deleteStripeConnectedBankAccount);

router.delete("/bank-account/:bankAccountId", authentication, removeExternalBankAccount);

export default router;