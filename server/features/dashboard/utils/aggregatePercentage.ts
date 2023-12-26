import mongoose from "mongoose"

type AggregatePercent = {
    input: string;
    total: number | string;
}

const aggregatePercentage = ({ input, total }: AggregatePercent) => {
    const map = {
        $map: {
            input,
            as: "target",
            in: {
                _id: "$$target._id",
                count: "$$target.count",
                percentage: {
                    $cond: [
                        { $eq: [total, 0] },
                        0,
                        {
                            $multiply: [
                                { $divide: ["$$target.count", total] }
                                ,
                                100
                            ]
                        }
                    ]
                }
            }
        }
    };
    return map;
}

export default aggregatePercentage;