import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomAuthRequest } from "../../middlewares/authentication";




//@desc get all services info
//@route GET /api/v1/service
//@access public
const getAllservices: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "All services" });
}


//@desc get single service info
//@route GET /api/v1/service/:serviceId
//@access public
const singleService: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "Single service" });
}


//@desc create a new service
//@route POST /api/v1/service
//@access authentication
const createService: RequestHandler = async (req: CustomAuthRequest, res) => {
    res.status(StatusCodes.CREATED).json({ msg: "Create service" });
}


//@desc update service
//@route PATCH /api/v1/service/:serviceId
//@access authentication
const updateService: RequestHandler = async (req: CustomAuthRequest, res) => {
    res.status(StatusCodes.OK).json({ msg: "Update service" });
}


//@desc delete service
//@route DELETE /api/v1/service/:serviceId
//@access authentication or authorized roles [admin, owner]
const deleteService: RequestHandler = async (req: CustomAuthRequest, res) => {
    res.status(StatusCodes.OK).json({ msg: "Delete service" });
}


//@desc upload service featured image 
//@route POST /api/v1/service/upload-featured
//@access authentication
const uploadFeaturedImg: RequestHandler = async (req: CustomAuthRequest, res) => {
    res.status(StatusCodes.OK).json({ msg: "Upload service's featured image" });
}


//@desc upload service gallery
//@route POST /api/v1/service/upload-gallery
//@access authentication
const uploadGallery: RequestHandler = async (req: CustomAuthRequest, res) => {
    res.status(StatusCodes.OK).json({ msg: "Upload service's gallery" });
}



export {
    getAllservices,
    singleService,
    createService,
    updateService,
    deleteService,
    uploadFeaturedImg,
    uploadGallery
}