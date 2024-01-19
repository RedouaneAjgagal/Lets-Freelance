import { getRequest } from "../../../services/api";

export type BoughtServicesStatusType = "inProgress" | "completed" | "canceled";

export type BoughtServiceType = {
    _id: string;
    freelancer: {
        status: BoughtServicesStatusType;
        profile: {
            _id: string;
            name: string;
            avatar: string;
            country: string | undefined;
            createdAt: string;
        };
    };
    service: {
        serviceInfo: string;
        title: string;
        tierName: "starter" | "standard" | "advanced";
    };
    payments: { amount: number }[];
    createdAt: string;
    completedAt: string;
}

type BoughtServicesType = BoughtServiceType[];

const getEmployerBoughtServices = async (status: "inprogress" | "completed" | "canceled" | "all") => {
    let query = "";

    if (status && status !== "all") {
        query = `?status=${status}`;
    }

    const response = await getRequest(`services/profile/bought-services${query}`);
    const data = await response.data as BoughtServicesType;
    return data;
}

export default getEmployerBoughtServices;