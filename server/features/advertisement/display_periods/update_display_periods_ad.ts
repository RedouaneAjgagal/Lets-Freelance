import advertisementModels from "../advertisement.model";
import getUpdateAdsData from "./generate_daily_display_periods";
import delay from "../../../utils/delay";

const updateDisplayPeriodsAds = async ({ limitPerRound, delayInMs }: { limitPerRound: number; delayInMs: number }) => {
    const getAds = await getUpdateAdsData();

    const BATCH_LIMIT = limitPerRound;
    let ROUND = 1;
    let isActive = true;

    while (isActive) {
        if (!getAds.length && ROUND === 1) {
            console.log(`Found no daily campaigns at ${new Date()}, to generate new display periods`);
            isActive = false;
            break;
        }

        const ads = getAds.slice(((BATCH_LIMIT * ROUND) - BATCH_LIMIT), ((BATCH_LIMIT * ROUND)));

        try {
            if (ads.length) {
                ROUND++;
                const updates = await advertisementModels.Ad.bulkWrite(ads);
                console.log(`${updates.modifiedCount} ads has generated new display periods for date: ${new Date()}`);
            }
        } catch (error) {
            console.log(`Error generating ads display periods, ${error}`);
            continue;
        }

        if (ads.length !== BATCH_LIMIT) {
            isActive = false;
            break;
        }

        await delay(delayInMs); // delay in ms between each batching update
    }
}

export default updateDisplayPeriodsAds;