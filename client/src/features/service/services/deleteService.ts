import { deleteRequest } from "../../../services/api"

type DeleteServiceResponse = {
    msg: string;
}

const deleteService = async (serviceId: string) => {
    const reponse = await deleteRequest(`services/${serviceId}`);
    const data = await reponse.data as DeleteServiceResponse;
    return data;
}

export default deleteService;