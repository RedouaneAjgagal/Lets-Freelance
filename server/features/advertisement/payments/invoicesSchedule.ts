import nodeSchedule from "node-schedule";
import setNewInvoices from "./setNewInvoices";

const scheduleInvoices = nodeSchedule.scheduleJob("0 12 * * 1,4", setNewInvoices); // run at 12:00 AM on Monday and Thursday

export default scheduleInvoices;