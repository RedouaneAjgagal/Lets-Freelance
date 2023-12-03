type CalculateCpc = {
    totalSpent: number;
    orders: number;
}

const calculateCpc = ({ totalSpent, orders }: CalculateCpc) => {
    const cpc = totalSpent / orders;
    return cpc
}

export default calculateCpc;