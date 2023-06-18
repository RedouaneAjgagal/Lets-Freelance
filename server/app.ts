import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";


// express
import express from "express";
const app = express();

// db
import dbConnection from "./db/dbConnection";



app.get("/", (req, res) => {
    res.json({ result: "Success" });
})

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