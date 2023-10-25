import nodeSchedule from "node-schedule";
import risingTalentUpgrade from "./rising_talent_upgrade";

const scheduleRisingTalentUpgrade = nodeSchedule.scheduleJob("30 8 */14 * 1", risingTalentUpgrade);
export default scheduleRisingTalentUpgrade;