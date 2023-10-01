import { Router } from "express";
import { getProposals, createProposal, actionProposal, setAsPaidFixedPriceJob } from "./proposal.controller";
import authentication from "../../middlewares/authentication";


const router = Router();

router.route("/")
    .get(authentication, getProposals)
    .post(authentication, createProposal);

router.route("/:proposalId")
    .patch(authentication, actionProposal);

router.route("/:proposalId/fixed-job")
    .get(authentication, setAsPaidFixedPriceJob);

export default router;