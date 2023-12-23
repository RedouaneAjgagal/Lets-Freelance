import express from "express";
import authentication from "../../middlewares/authentication";
import { toggleFavourite, getFavourites } from "./favourite.controller";


const router = express.Router();

router.route("/")
    .get(authentication, getFavourites)
    .post(authentication, toggleFavourite);


export default router;