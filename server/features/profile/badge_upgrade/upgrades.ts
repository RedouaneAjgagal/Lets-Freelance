import nodeSchedule from "node-schedule";
import risingTalentUpgrade from "./rising_talent_upgrade";
import topRatedUpgrade from "./top_rated_upgrade";

const scheduleRisingTalentUpgrade = nodeSchedule.scheduleJob("30 8 */14 * 1", risingTalentUpgrade); // every two week at 8:30
const scheduleTopRatedUpgrade = nodeSchedule.scheduleJob("30 10 */14 * 1", topRatedUpgrade); // every two week at 10:30

const profileBadgesUpgrade = {
    scheduleRisingTalentUpgrade,
    scheduleTopRatedUpgrade
}

export default profileBadgesUpgrade;