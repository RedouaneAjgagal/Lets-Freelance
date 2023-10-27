import Profile, { IProfile } from "../profile.model";
import mongoose from "mongoose";

type BatchingUpgrade = {
    aggregateProfiles: { _id: string }[];
    batchLimit: number;
    delayInMs: number;
    upgradeTo: "rising talent" | "top rated" | "top rated plus";
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const upgradeConnects = {
    "top rated plus": 35,
    "top rated": 16,
    "rising talent": 10,
}

const batchingUpgrade = async ({ delayInMs, aggregateProfiles, upgradeTo, batchLimit }: BatchingUpgrade) => {
    const BATCH_LIMIT = batchLimit;
    let ROUND = 1;
    let isActive = true;

    const updatedData: mongoose.UpdateQuery<IProfile> = {
        $set: { "roles.freelancer.badge": upgradeTo },
        $inc: { "roles.freelancer.connects.connectionsCount": upgradeConnects[upgradeTo] }
    }

    while (isActive) {
        const profiles = aggregateProfiles.slice(((BATCH_LIMIT * ROUND) - BATCH_LIMIT), ((BATCH_LIMIT * ROUND)));

        if (!profiles.length && ROUND === 1) {
            console.log(`Found no qualified profiles to upgrade to '${upgradeTo.toUpperCase()}'`);
        }

        try {
            if (profiles.length) {
                ROUND++;
                const updatedProfiles = await Profile.updateMany({ _id: { $in: profiles } }, updatedData);
                console.log(`Upgrading ${updatedProfiles.modifiedCount} profiles to '${upgradeTo.toUpperCase()}' on ${new Date()}`);
            }
        } catch (error) {
            console.log(`Error Upgrading profiles to '${upgradeTo.toUpperCase()}', ${error}`);
        }

        if (profiles.length !== BATCH_LIMIT) {
            isActive = false;
            break;
        }

        await delay(delayInMs); // delay in ms between each batching update
    }
}

export default batchingUpgrade;