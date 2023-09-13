import { Router } from "express";
import { getContracts, cancelContract, cancelationRequests, updateContract } from "./contract.controller";
import authentication from "../../middlewares/authentication";
import authorization from "../../middlewares/authorization";

const router = Router();

router.route("/")
    .get(authentication, getContracts);

router.route("/cancel-requests")
    .get(authorization("admin"), cancelationRequests);

router.route("/:contractId")
    .post(authentication, cancelContract)
    .patch(authentication, updateContract);

export default router;