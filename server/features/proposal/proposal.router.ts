import { Router } from "express";
import { getProposals, createProposal, actionProposal } from "./proposal.controller";
import authentication from "../../middlewares/authentication";


const router = Router();

router.route("/")
    .get(authentication, getProposals)
    .post(authentication, createProposal);

router.route("/:proposalId")
    .patch(authentication, actionProposal);

export default router;