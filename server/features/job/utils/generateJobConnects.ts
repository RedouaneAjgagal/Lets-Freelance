import { JobDuration } from "../job.model";
import jobFees from "../job.fees";

type FixedPriceJobConnects = {
    jobPrice: number
}

type HourlyPriceJobConnects = {
    price: {
        min: number;
        max: number;
    };
    jobDuration: JobDuration
}

const { connectsPerJob } = jobFees;

const fixedPriceJob = ({ jobPrice }: FixedPriceJobConnects) => {
    const connect = Math.round((jobPrice / 100) * connectsPerJob.fixedPriceJob.percent);
    return connect < connectsPerJob.min ? connectsPerJob.min : connect > connectsPerJob.max ? connectsPerJob.max : connect;
}


const hourlyPriceJob = ({ price, jobDuration }: HourlyPriceJobConnects) => {
    let connect = connectsPerJob.min;
    const getMidPrice = ((price.max - price.min) / 2) + price.min;

    const getPercent = (funcDurationName: "starterDuration" | "standardDuration" | "advancedDuration") => {
        const { lowPercent, midPercent, highPercent } = connectsPerJob.hourlyPriceJob[funcDurationName];
        const getPercent = getMidPrice < 50 ? lowPercent : getMidPrice < 100 ? midPercent : highPercent;
        return Math.round((getMidPrice / 100) * getPercent);
    }

    if (jobDuration.dateType === "hours" || (jobDuration.dateType === "days" && jobDuration.dateValue <= 3)) {
        connect = getPercent("starterDuration");
    } else if (jobDuration.dateType === "days" || (jobDuration.dateType === "months" && jobDuration.dateValue < 2)) {
        connect = getPercent("standardDuration");
    } else {
        connect = getPercent("advancedDuration");
    }

    return connect < connectsPerJob.min ? connectsPerJob.min : connect > connectsPerJob.max ? connectsPerJob.max : connect;
}

const generateJobConnects = {
    fixedPriceJob,
    hourlyPriceJob
}

export default generateJobConnects;