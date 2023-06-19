import bcrypt from "bcrypt";

const compareData = async (unhashedData: string, hashedData: string) => {
    const isValidData = await bcrypt.compare(unhashedData, hashedData);
    return isValidData;
}

export default compareData;