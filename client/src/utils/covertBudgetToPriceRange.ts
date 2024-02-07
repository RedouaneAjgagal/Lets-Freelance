const convertBudgetToPriceRange = ({ from, to }: { from: number; to: number }) => {
    const priceRange = `${from},${to}`;
    return priceRange;
}

export default convertBudgetToPriceRange;