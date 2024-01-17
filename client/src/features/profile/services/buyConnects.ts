import { postRequest } from "../../../services/api"

type buyConnects = {
    url: string;
}

const buyConnects = async ({ connects }: { connects: number }) => {
    const reponse = await postRequest("profiles/connects", {
        connects
    });

    const data = await reponse.data as buyConnects;
    return data;
}

export default buyConnects;