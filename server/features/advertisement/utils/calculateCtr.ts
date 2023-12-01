type CalcCtr = {
    clicks: number;
    impressions: number;
}

const calculateCtr = ({ clicks, impressions }: CalcCtr) => {
    const ctr = (clicks / impressions) * 100;
    return ctr;
}

export default calculateCtr