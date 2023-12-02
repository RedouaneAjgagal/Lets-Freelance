type CalculateCr = {
    orders: number;
    clicks: number;
}

const calculateCr = ({ orders, clicks }: CalculateCr) => {
    const cr = (orders / clicks) * 100;
    return cr
}

export default calculateCr;