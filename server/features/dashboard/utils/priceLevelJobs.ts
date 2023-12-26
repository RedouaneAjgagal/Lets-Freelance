const hourlyJob = {
    low: {
        min: 0,
        max: 10
    },
    mid: {
        min: 10,
        max: 50
    }
}

const fixedJob = {
    low: {
        min: 0,
        max: 50
    },
    mid: {
        min: 50,
        max: 500
    },
    high: {
        min: 500,
        max: 1500
    }
}

const priceLevelJobs = {
    hourlyJob,
    fixedJob
}

export default priceLevelJobs;