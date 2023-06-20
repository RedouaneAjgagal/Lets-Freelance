import crypto from "crypto";

type CreateHash = {
    algorithm: string;
    value: string;
}

const createHash = ({ algorithm, value }: CreateHash) => {
    const hashedData = crypto.createHash(algorithm).update(value).digest("hex");
    return hashedData;
}

export default createHash;