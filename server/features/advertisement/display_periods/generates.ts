import nodeSchedule from "node-schedule";
import updateDisplayPeriodsAds from "./update_display_periods_ad";

const displayPeriodsGeneration = nodeSchedule.scheduleJob("*/15 * * * *", updateDisplayPeriodsAds.bind(null, { limitPerRound: 500, delayInMs: 1500 }));

export default displayPeriodsGeneration;