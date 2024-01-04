import { getRequest } from "../../../services/api";

type FreelancerReportsProfileType = {
    name: string;
    avatar: string;
    rating: {
        avgRate: number | undefined;
        numOfReviews: number;
    };
    badge: "none" | "raising talent" | "top rated" | "top rated plus";
};

type FreelnacerReportsServiceType = {
    postedServices: number;
    completedServices: number;
    inQueueServices: number;
    servicesRevenue: number;
};

type FreelnacerReportsJobType = {
    completedJobs: number;
    inQueueJobs: number;
    jobsRevenue: number;
};

type FreelnacerReportsProposalType = {
    approvedProposals: number;
    interviewingProposals: number;
    rejectedProposals: number;
};

type FreelnacerReportsConnectType = {
    connectsSpentOnProposals: number;
    connectsSpendToBoostProposals: number;
    totalSpentOnConnects: number;
};

export type FreelnacerReportsType = {
    _id: string;
    profile: FreelancerReportsProfileType;
    service: FreelnacerReportsServiceType;
    job: FreelnacerReportsJobType;
    proposal: FreelnacerReportsProposalType;
    connect: FreelnacerReportsConnectType;
}


const getFreelancerReports = async () => {
    const response = await getRequest("profiles/freelancers/reports");
    const freelancerReports = await response.data as FreelnacerReportsType;
    return freelancerReports;
}

export default getFreelancerReports;