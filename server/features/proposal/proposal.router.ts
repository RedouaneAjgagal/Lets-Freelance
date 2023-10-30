import { Router } from "express";
import { getProposals, createProposal, actionProposal, setAsPaidFixedPriceJob, getFreelancerProposals } from "./proposal.controller";
import authentication from "../../middlewares/authentication";


const router = Router();

router.route("/")
    .get(authentication, getProposals)
    .post(authentication, createProposal);

router.route("/profile/freelancer-proposals")
    .get(authentication, getFreelancerProposals);

router.route("/:proposalId")
    .patch(authentication, actionProposal);

router.route("/:proposalId/fixed-job")
    .get(authentication, setAsPaidFixedPriceJob);

export default router;