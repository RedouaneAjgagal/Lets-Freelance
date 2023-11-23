import nodeSchedule from "node-schedule";
import updateDisplayPeriodsAds from "./update_display_periods_ad";

const displayPeriodsGeneration = nodeSchedule.scheduleJob("*/15 * * * *", updateDisplayPeriodsAds.bind(null, { limitPerRound: 100, delayInMs: 5000 }));

export default displayPeriodsGeneration;