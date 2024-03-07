import { Router } from "express";
import { getContracts, cancelContractRequest, cancelationRequests, completeServiceContract, completeJobContract, cancelContract, submitWorkedHours, payWorkedHours, setAsPaidHours, refundPaidAmount, createRefundRequest, getRefundRequests, getSingleContract } from "./contract.controller";
import authentication from "../../middlewares/authentication";
import authorization from "../../middlewares/authorization";
import contractController from "../dashboard/contract/contract.controller";

const router = Router();

router.route("/")
    .get(authentication, getContracts);

router.route("/cancel-requests")
    .get(authentication, authorization("admin"), cancelationRequests)
    .patch(authentication, authorization("admin"), cancelContract);

router.route("/refund")
    .get(authentication, authorization("admin"), getRefundRequests);

router.route("/:contractId")
    .get(authentication, getSingleContract)
    .post(authentication, cancelContractRequest);

router.route("/:contractId/worked-hours")
    .get(authentication, setAsPaidHours)
    .post(authentication, submitWorkedHours)
    .patch(authentication, payWorkedHours);

router.route("/:contractId/refund")
    .post(authentication, createRefundRequest)
    .patch(authentication, authorization("admin"), refundPaidAmount);

router.route("/:contractId/service")
    .patch(authentication, completeServiceContract);

router.route("/:contractId/job")
    .patch(authentication, completeJobContract);


// authorized analytics
router.get("/analysis/contract", authentication, authorization("admin"), contractController.getConctractAnalysis);

export default router;