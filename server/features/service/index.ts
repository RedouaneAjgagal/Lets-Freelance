import serviceRouter from "./service.router";
import serviceModel, { ServicePlan, ServiceWithoutRefs, IService } from "./service.model";
import serviceFees from "./service.fees";
import getServicePriceAfterFees from "./utils/getServicePriceAfterFees";

export {
    serviceRouter,
    serviceModel,
    ServicePlan,
    ServiceWithoutRefs,
    IService,
    serviceFees,
    getServicePriceAfterFees
}