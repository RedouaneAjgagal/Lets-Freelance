import express from "express";
import authentication from "../../middlewares/authentication";
import { toggleFavourite } from "./favourite.controller";


const router = express.Router();

router.route("/")
    .post(authentication, toggleFavourite);


export default router;