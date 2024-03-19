import Stripe from "stripe";

declare module 'express-serve-static-core' {
    interface Request {
        rawBody?: string;
    }
}