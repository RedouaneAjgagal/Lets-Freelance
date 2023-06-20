import jwt from "jsonwebtoken";

const createJwtToken = ({ payload, expiresIn }: { payload: {}, expiresIn: number }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
    return token;
}

export default createJwtToken;