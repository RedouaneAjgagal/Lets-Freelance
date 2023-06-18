import { RequestHandler } from "express";
import { NotFoundError } from "../errors";

const notFound: RequestHandler = () => {
    throw new NotFoundError("Route is not exist");
}

export default notFound;