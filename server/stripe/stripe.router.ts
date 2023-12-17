import express from "express";
import invoiceWebhook from "./webhooks/invoiceWebhook";

const router = express.Router();

router.post("/invoices", express.raw({ type: "application/json" }), invoiceWebhook);

export default router;