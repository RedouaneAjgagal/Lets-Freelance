import express from "express";
import statementControllers from "../dashboard/statements/statement.controller";
import authentication from "../../middlewares/authentication";
import authorization from "../../middlewares/authorization";

const router = express.Router();

router.get("/services", authentication, authorization("owner"), statementControllers.getServiceStatements);


export default router;