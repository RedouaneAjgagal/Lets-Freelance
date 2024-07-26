import express, { Request } from "express";
import invoiceWebhook from "./webhooks/invoiceWebhook";

export interface RawBodyRequest extends Request {
    rawBody?: string;
}

const router = express.Router();

router.post("/invoices", express.raw({ type: "application/json" }), ((req: RawBodyRequest, res) => invoiceWebhook(req, res)));

export default router;