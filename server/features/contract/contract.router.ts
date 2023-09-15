import { Router } from "express";
import { getContracts, cancelContractRequest, cancelationRequests, completeContract, cancelContract } from "./contract.controller";
import authentication from "../../middlewares/authentication";
import authorization from "../../middlewares/authorization";

const router = Router();

router.route("/")
    .get(authentication, getContracts);

router.route("/cancel-requests")
    .get(authentication, authorization("admin"), cancelationRequests)
    .patch(authentication, authorization("admin"), cancelContract);

router.route("/:contractId")
    .post(authentication, cancelContractRequest)
    .patch(authentication, completeContract);

export default router;