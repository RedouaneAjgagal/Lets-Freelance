import { getRequest } from "../../../services/api"

type SetAsPaidConnectsType = {
    msg: string;
}

const setAsPaidConnects = async (sessionId: string) => {
    const response = await getRequest(`profiles/connects?session_id=${sessionId}`);
    const data = await response.data as SetAsPaidConnectsType;
    return data;
}

export default setAsPaidConnects;