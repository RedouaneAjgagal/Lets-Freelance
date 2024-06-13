import { IncomingMessage } from "http";

import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";

// express
import express from "express";
const app = express();

// db
import dbConnection from "./db/dbConnection";

// origin
import origin from "./config/origin";

// extra packages
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import http from "http";

// routes
import { authRouter } from "./features/auth";
import { profileRouter } from "./features/profile";
import { serviceRouter } from "./features/service";
import { jobRouter } from "./features/job";
import { reviewRouter } from "./features/review";
import { proposalRouter } from "./features/proposal";
import { contractRouter } from "./features/contract";
import { advertisementRouter } from "./features/advertisement";
import { stripeRouter } from "./stripe/index";
import { reportRouter } from "./features/report";
import { favouriteRouter } from "./features/favourite";
import { statementRouter } from "./features/statement";
import { messageRouter } from "./features/message";


// middlewares
import notFoundMiddleware from "./middlewares/notFound";
import errorHandlerMiddleware from "./middlewares/handleErrors";


// websocket
import websockets from "./websockets";
import { handleWebSocketMessages } from "./features/message";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
});

app.use(express.json({
    verify: (req: IncomingMessage & { rawBody: string }, res, buf) => {
        req.rawBody = buf.toString();
    }
}));
app.use(cors({
    origin,
    credentials: true
}));
app.use(helmet());
app.use(mongoSanitize());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(fileUpload({ useTempFiles: true, safeFileNames: true }));


// websocket
const server = http.createServer(app);
const wss = websockets(server);

// messaging system
handleWebSocketMessages(wss);



app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profiles", profileRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/proposals", proposalRouter);
app.use("/api/v1/contracts", contractRouter);
app.use("/api/v1/advertisements", advertisementRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/favourites", favouriteRouter);
app.use("/api/v1/statements", statementRouter);
app.use("/api/v1/messages", messageRouter);


// webhooks
app.use("/api/v1/stripe-webhook", stripeRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await dbConnection(process.env.MONGO_URI!);
        server.listen(port, () => {
            console.log(`Server is running on ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();