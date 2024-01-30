import { postRequest } from "../../../services/api"

type BuyConnects = {
    url: string;
}

const buyConnects = async ({ connects }: { connects: number }) => {
    const reponse = await postRequest("profiles/connects", {
        connects
    });

    const data = await reponse.data as BuyConnects;
    return data;
}

export default buyConnects;