import { Router } from "express";
import { getContracts, cancelContractRequest, cancelationRequests, completeServiceContract, completeJobContract, cancelContract, submitWorkedHours, payWorkedHours } from "./contract.controller";
import authentication from "../../middlewares/authentication";
import authorization from "../../middlewares/authorization";

const router = Router();

router.route("/")
    .get(authentication, getContracts);

router.route("/cancel-requests")
    .get(authentication, authorization("admin"), cancelationRequests)
    .patch(authentication, authorization("admin"), cancelContract);

router.route("/:contractId")
    .post(authentication, cancelContractRequest);

router.route("/:contractId/worked-hours")
    .post(authentication, submitWorkedHours)
    .patch(authentication, payWorkedHours);

router.route("/:contractId/service")
    .patch(authentication, completeServiceContract);

router.route("/:contractId/job")
    .patch(authentication, completeJobContract);

export default router;