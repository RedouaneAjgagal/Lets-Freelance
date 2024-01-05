import { getRequest } from "../../../services/api";
import { Category } from "../../profile/helpers/getFormatedCategory";

type FreelancerProposalJobType = {
    _id: string;
    title: string;
    category: Category;
    locationType: "remote" | "onsite";
}

type FreelancerProposalType = {
    _id: string;
    job: FreelancerProposalJobType;
    coverLetter: string;
    priceType: "fixed" | "hourly";
    price: number;
    status: "pending" | "approved" | "rejected";
    boostProposal: {
        spentConnects: number;
    };
    createdAt: string;
}

type FreelancerProposalsType = FreelancerProposalType[];


const getFreelancerProposals = async () => {
    const response = await getRequest("proposals/profile/freelancer-proposals");
    const freelancerProposals = await response.data as FreelancerProposalsType;
    return freelancerProposals;
}

export default getFreelancerProposals;