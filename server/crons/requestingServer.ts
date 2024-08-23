import nodeSchedule from "node-schedule";
import https from "https";
import { backendUrl } from "../config/origin";

const requestingServerHandler = () => {
    console.log("Restarting the server..");

    https
        .get(backendUrl, (res) => {
            if (res.statusCode === 200) {
                console.log("Server restarted");
            } else {
                console.error(`Failed to restart the server with status ${res.statusCode}`);
            }
        })
        .on("error", (err) => {
            console.error(`Error during restart: ${err.message}`);
        });
};


const start = () => {
    nodeSchedule.scheduleJob("*/14 * * * *", requestingServerHandler);
}

export default start;