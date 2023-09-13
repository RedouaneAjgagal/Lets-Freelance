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

// routes
import { authRouter } from "./features/auth";
import { profileRouter } from "./features/profile";
import { serviceRouter } from "./features/service";
import { jobRouter } from "./features/job";
import { reviewRouter } from "./features/review";
import { proposalRouter } from "./features/proposal";
import { contractRouter } from "./features/contract";


// middlewares
import notFoundMiddleware from "./middlewares/notFound";
import errorHandlerMiddleware from "./middlewares/handleErrors";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
});


app.use(express.json());
app.use(cors({
    origin,
    credentials: true
}));
app.use(helmet());
app.use(mongoSanitize());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(fileUpload({ useTempFiles: true, safeFileNames: true }));


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profiles", profileRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/proposals", proposalRouter);
app.use("/api/v1/contracts", contractRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await dbConnection(process.env.MONGO_URI!);
        app.listen(port, () => {
            console.log(`Server is running on ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();