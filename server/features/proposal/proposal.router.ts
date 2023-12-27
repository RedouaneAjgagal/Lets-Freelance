import { Router } from "express";
import { getProposals, createProposal, actionProposal, setAsPaidFixedPriceJob, getFreelancerProposals } from "./proposal.controller";
import authentication from "../../middlewares/authentication";
import authorization from "../../middlewares/authorization";
import proposalControllers from "../dashboard/proposal/proposal.controller";


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

// authorized analytics
router.get("/analysis/proposal", authentication, authorization("admin"), proposalControllers.getProposalAnalysis);

export default router;