import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomAuthRequest } from "../../middlewares/authentication";
import createServiceValidator from "./validators/createServiceValidator";
import { User } from "../auth";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import Service, { ServiceWithoutRefs } from "./service.model";
import rolePermissionChecker from "../../utils/permissionChecker";
import uploadImage from "../../utils/uploadImage";
import { UploadedFile } from "express-fileupload";
import getUpdatedServiceInfo from "./helpers/getUpdatedServiceInfo";




//@desc get all services info
//@route GET /api/v1/service
//@access public
const getAllservices: RequestHandler = async (req, res) => {
    const { category, delivery_time, english_level, search, country, price_range } = req.query;
    let searchQuery: Partial<{
        title: { $regex: string; $options: string; };
        category: string;
        $or: {}[];
        $and: {}[];
    }> = {};


    // search by title
    if (search && search.toString().trim() !== "") {
        searchQuery.title = { $regex: search.toString(), $options: "i" }
    }


    // seach by category
    const categories = ["digital-marketing", "design-creative", "programming-tech", "writing-translation", "video-animation", "finance-accounting", "music-audio"];
    if (category && categories.includes(category.toString())) {
        const formatCategory = category === "digital-marketing" ? category.toString().split("-").join(" ") : category.toString().split("-").join(" & ");
        searchQuery.category = formatCategory;
    }


    // search by delivery time
    const isDeliveryTimeOnlyNumbers = delivery_time && /^\d+$/.test(delivery_time.toString());
    if (isDeliveryTimeOnlyNumbers) {

        if (!searchQuery.$or) searchQuery.$or = [];

        const seachByDeliveryTime = [{ "tier.starter.deliveryTime": +delivery_time }, { "tier.standard.deliveryTime": +delivery_time }, { "tier.advanced.deliveryTime": +delivery_time }];
        searchQuery.$or.push(...seachByDeliveryTime);
    }


    // search by price
    const isValidPriceRange = price_range && price_range.toString().trim() !== "" && /^\d+,\d+$/.test(price_range.toString());
    if (isValidPriceRange) {

        if (!searchQuery.$and) searchQuery.$and = [];

        const [fromPrice, toPrice] = price_range.toString().split(",");

        const searchByPriceRange = [{ "tier.starter.price": { $gte: fromPrice } }, { "tier.starter.price": { $lte: toPrice } }]
        searchQuery.$and.push(...searchByPriceRange);
    }


    // search by keywords..


    let services = await Service.find(searchQuery).select("featuredImage title category tier.starter.price").populate("profile", "roles.freelancer.englishLevel country avatar name").lean();


    // search by english level
    const englishLevelList = ["basic", "conversational", "fluent", "native", "professional"];
    if (english_level && englishLevelList.includes(english_level.toString())) {
        services = services.filter(service => service.profile!.roles!.freelancer!.englishLevel === english_level.toString());
    }


    // search by location
    if (country && country.toString().trim() !== "") {
        services = services.filter(service => service.profile!.country!.toLowerCase() === country.toString().toLowerCase());
    }


    // search by rating..


    const totalServices = await Service.countDocuments();

    res.status(StatusCodes.OK).json({ totalSearchedServices: services.length, services, totalServices });
    // res.status(StatusCodes.OK).json({});
}


//@desc get single service info
//@route GET /api/v1/service/:serviceId
//@access public
const singleService: RequestHandler = async (req, res) => {
    const { serviceId } = req.params;
    if (!serviceId || serviceId.trim() === "") {
        throw new BadRequestError("Service id is messing");
    }

    // find the service
    const service = await Service.findById(serviceId).populate("profile", "name avatar");

    // check if service exist
    if (!service) {
        throw new NotFoundError(`Found no service with id ${serviceId}`);
    }

    res.status(StatusCodes.OK).json(service);
}


//@desc create a new service
//@route POST /api/v1/service
//@access authentication
const createService: RequestHandler = async (req: CustomAuthRequest, res) => {
    const inputs = req.body;

    // check if valid inputs
    createServiceValidator(inputs);

    const user = await User.findById(req.user!.userId).populate("profile", "_id -user");

    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    const serviceInfo: ServiceWithoutRefs = {
        title: inputs.title,
        description: inputs.description,
        category: inputs.category,
        featuredImage: inputs.featuredImage,
        gallery: inputs.gallery,
        tier: inputs.tier,
        serviceKeywords: inputs.serviceKeywords
    }

    // create service
    await Service.create({ ...serviceInfo, user: user._id, profile: user.profile!._id });

    res.status(StatusCodes.CREATED).json({ msg: "You have created a service successfully" });
}


//@desc update service
//@route PATCH /api/v1/service/:serviceId
//@access authentication
const updateService: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { serviceId } = req.params;
    if (!serviceId || serviceId.trim() === "") {
        throw new BadRequestError("Service id is messing");
    }

    // find service
    const service = await Service.findById(serviceId);
    if (!service) {
        throw new NotFoundError(`Found no service with id ${serviceId}`);
    }

    // check permission
    if (service.user._id.toString() !== req.user!.userId) {
        throw new UnauthorizedError("You dont have access to edit this recipe");
    }

    // get updated info
    const inputs = req.body;
    const updatedServiceInfo = getUpdatedServiceInfo(inputs);

    // update service
    await service.updateOne(updatedServiceInfo);

    res.status(StatusCodes.OK).json({ msg: "You have updated the service successfully" });
}


//@desc delete service
//@route DELETE /api/v1/service/:serviceId
//@access authentication or authorized roles [admin, owner]
const deleteService: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { serviceId } = req.params;
    if (!serviceId || serviceId.trim() === "") {
        throw new BadRequestError("Service id is messing");
    }

    // find the service
    const service = await Service.findById(serviceId);

    // check if service exist
    if (!service) {
        throw new NotFoundError(`Found no service with id ${serviceId}`);
    }

    // find the current user
    const currentUser = await User.findById(req.user!.userId);
    if (!currentUser) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the current user is an admin or owner
    const hasValidRole = rolePermissionChecker({
        allowedRoles: ["admin", "owner"],
        currentRole: currentUser.role
    });

    if (hasValidRole) {
        if (currentUser.role !== "owner") {
            // create data analytics later for the owner dashboard
        }

        await service.deleteOne();
        return res.status(StatusCodes.OK).json({ msg: `You have deleted service with id ${service._id}` });
    }

    // check if service belong to the current user
    if (currentUser._id.toString() !== service.user._id.toString()) {
        throw new UnauthorizedError("You dont have access to delete this service");
    }

    // delete the service
    await service.deleteOne();

    res.status(StatusCodes.OK).json({ msg: "Your service has been deleted" });
}


//@desc upload service featured image 
//@route POST /api/v1/service/upload-featured
//@access authentication
const uploadFeaturedImg: RequestHandler = async (req: CustomAuthRequest, res) => {
    const user = await User.findById(req.user!.userId);
    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    const imageFile = req.files?.featuredServiceImg as UploadedFile;

    const imageResponse = await uploadImage({
        folderName: "services_lets-freelance",
        imageFile: imageFile,
        maxSize: 1024 * 1024
    })
    res.status(StatusCodes.OK).json({ featuredImgURL: imageResponse.secure_url });
}


//@desc upload service gallery
//@route POST /api/v1/service/upload-gallery
//@access authentication
const uploadGallery: RequestHandler = async (req: CustomAuthRequest, res) => {
    const user = await User.findById(req.user!.userId);
    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    const imageFile = req.files?.gallery as UploadedFile;

    const imageResponse = await uploadImage({
        folderName: "services_lets-freelance",
        imageFile: imageFile,
        maxSize: 1024 * 1024
    })
    res.status(StatusCodes.OK).json({ galleryImgURL: imageResponse.secure_url });
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