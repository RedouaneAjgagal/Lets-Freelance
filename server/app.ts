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

// middlewares
import notFoundMiddleware from "./middlewares/notFound";
import errorHandlerMiddleware from "./middlewares/handleErrors";


app.use(express.json());
app.use(cors({
    origin,
    credentials: true
}));
app.use(helmet());
app.use(mongoSanitize());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.get("/api/v1", (req, res) => {
    res.json({ result: "Success" });
});

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