import express from "express";
import statementControllers from "../dashboard/statements/statement.controller";
import authentication from "../../middlewares/authentication";
import authorization from "../../middlewares/authorization";

const router = express.Router();

router.get("/services", authentication, authorization("owner"), statementControllers.getServiceStatements);
router.get("/jobs/fixed", authentication, authorization("owner"), statementControllers.getFixedJobStatements);
router.get("/jobs/hourly", authentication, authorization("owner"), statementControllers.getHourlyJobStatements);
router.get("/connects", authentication, authorization("owner"), statementControllers.getConnectStatements);


export default router;