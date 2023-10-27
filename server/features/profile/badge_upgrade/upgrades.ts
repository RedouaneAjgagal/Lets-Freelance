import nodeSchedule from "node-schedule";
import risingTalentUpgrade from "./rising_talent_upgrade";
import topRatedUpgrade from "./top_rated_upgrade";
import topRatedPlusUpgrade from "./top_rated_plus_upgrade";

const scheduleRisingTalentUpgrade = nodeSchedule.scheduleJob("30 8 */14 * 1", risingTalentUpgrade); // every two week at 8:30 AM
const scheduleTopRatedUpgrade = nodeSchedule.scheduleJob("30 10 */14 * 1", topRatedUpgrade); // every two week at 10:30 AM
const scheduleTopRatedPlusUpgrade = nodeSchedule.scheduleJob("* 14 */30 * 1", topRatedPlusUpgrade); // every 30 days at 2:00 PM


const profileBadgesUpgrade = {
    scheduleRisingTalentUpgrade,
    scheduleTopRatedUpgrade,
    scheduleTopRatedPlusUpgrade
}

export default profileBadgesUpgrade;