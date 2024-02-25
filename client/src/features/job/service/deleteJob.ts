import { deleteRequest } from "../../../services/api"

type DeleteJobResponse = { msg: string };

const deleteJob = async (jobId: string) => {
    const response = await deleteRequest(`jobs/${jobId}`);
    const data = await response.data as DeleteJobResponse;
    return data;
}

export default deleteJob;