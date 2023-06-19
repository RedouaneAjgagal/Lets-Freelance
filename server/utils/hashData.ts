import bcrypt from "bcrypt";

const hashData = async (data: string, salt: number) => {
    const generateSalt = await bcrypt.genSalt(salt);
    const hashedData = await bcrypt.hash(data, generateSalt);
    return hashedData;
}

export default hashData;