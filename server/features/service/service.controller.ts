import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomAuthRequest } from "../../middlewares/authentication";
import createServiceValidator from "./validators/createServiceValidator";
import { User } from "../auth";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import Service, { ServiceWithoutRefs } from "./service.model";
import rolePermissionChecker from "../../utils/rolePermissionChecker";
import uploadImage from "../../utils/uploadImage";
import { UploadedFile } from "express-fileupload";
import getUpdatedServiceInfo from "./helpers/getUpdatedServiceInfo";
import userAsPermission from "../../helpers/userAsOnly";
import { isValidObjectId } from "mongoose";
import { Profile } from "../profile";
import { contractModel as Contract } from "../contract";
import sendOrderServiceEmail from "./services/sendOrderServiceEmail";




//@desc get all services info
//@route GET /api/v1/services
//@access public
const getAllservices: RequestHandler = async (req, res) => {
    const { category, delivery_time, english_level, search, country, price_range, page } = req.query;
    let searchQuery: Partial<{
        category: string;
        $or: {}[];
        $and: {}[];
    }> = {};


    // search by keywords & title
    if (search && search.toString().trim() !== "") {
        searchQuery.$or = [];

        // search by keyword first 
        searchQuery.$or.push({ keywords: { $in: [search.toString()] } });

        // if no keyword exist then search by title
        searchQuery.$or.push({ title: { $regex: search!.toString(), $options: "i" } });
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

        const searchByPriceRange = [{ "tier.starter.price": { $gte: fromPrice } }, { "tier.starter.price": { $lte: toPrice } }];
        searchQuery.$and.push(...searchByPriceRange);
    }


    // search by page
    const currentPage = page && /^\d+$/.test(page.toString()) ? Number(page) : 1;
    const limit = 12;
    const start = (currentPage - 1) * limit;
    const end = currentPage * 12;


    let services = await Service.find(searchQuery).select("featuredImage title category tier.starter.price").populate({ path: "profile", select: "name avatar country userAs roles.freelancer.englishLevel" }).lean();

    services = services.filter(service => service.profile.userAs === "freelancer");


    // search by english level
    const englishLevelList = ["basic", "conversational", "fluent", "native", "professional"];
    if (english_level && englishLevelList.includes(english_level.toString())) {
        services = services.filter(service => service.profile!.roles!.freelancer!.englishLevel === english_level.toString());
    }


    // search by location
    if (country && country.toString().trim() !== "") {
        services = services.filter(service => service.profile!.country!.toLowerCase() === country.toString().toLowerCase());
    }


    // search by rating (later..)


    // get number of pages for pagination
    const numOfPages = Math.ceil(services.length / limit);

    res.status(StatusCodes.OK).json({ numOfPages, services: services.slice(start, end) });
}


//@desc get single service info
//@route GET /api/v1/services/:serviceId
//@access public
const singleService: RequestHandler = async (req, res) => {
    const { serviceId } = req.params;
    if (!serviceId || serviceId.trim() === "") {
        throw new BadRequestError("Service id is messing");
    }

    // find the service
    const service = await Service.findById(serviceId).populate("profile", "name avatar userAs");

    // check if service exist
    if (!service) {
        throw new NotFoundError(`Found no service with id ${serviceId}`);
    }

    // check if role is not freelancer (changed role)
    if (service.profile.userAs !== "freelancer") {
        throw new UnauthorizedError(`${service.profile.name} is no longer a freelancer`);
    }

    res.status(StatusCodes.OK).json(service);
}


//@desc create a new service
//@route POST /api/v1/services
//@access authentication (freelancers only)
const createService: RequestHandler = async (req: CustomAuthRequest, res) => {
    const inputs = req.body;

    // find user
    const user = await User.findById(req.user!.userId).populate("profile", "_id userAs -user");

    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if user is a freelancer
    userAsPermission({
        currentUserRole: user.profile!.userAs!,
        permissionedRole: "freelancer"
    });


    // check if valid inputs
    createServiceValidator(inputs);


    const serviceInfo: ServiceWithoutRefs = {
        title: inputs.title,
        description: inputs.description,
        category: inputs.category,
        featuredImage: inputs.featuredImage,
        gallery: inputs.gallery,
        tier: inputs.tier,
        keywords: inputs.keywords
    }

    // create service
    await Service.create({ ...serviceInfo, user: user._id, profile: user.profile!._id });

    res.status(StatusCodes.CREATED).json({ msg: "You have created a service successfully" });
}


//@desc update service
//@route PATCH /api/v1/services/:serviceId
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
//@route DELETE /api/v1/services/:serviceId
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
//@route POST /api/v1/services/upload-featured
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
//@route POST /api/v1/services/upload-gallery
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

//@desc an employer can order the service
//@route POST /api/v1/services/:serviceId/order
//@access authentication
const orderService: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { serviceId } = req.params;
    const { tier } = req.body;

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(serviceId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid id");
    }

    // find service
    const service = await Service.findById(serviceId).populate([{ path: "profile", select: "_id userAs" }, { path: "user", select: "_id email" }]);
    if (!service) {
        throw new NotFoundError(`Found no service with id ${serviceId}`);
    }

    // find profile
    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "_id email" });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the profile is an employer
    if (profile.userAs !== "employer") {
        throw new UnauthorizedError("Must be an employer to order services");
    }

    // check if the service creator is still a freelancer
    if (service.profile!.userAs !== "freelancer") {
        throw new UnauthorizedError("This user is no longer a freelancer");
    }

    // check if the service doesnt belong to the current employer
    if (service.profile._id.toString() === profile._id.toString()) {
        throw new BadRequestError("You can't order your own service");
    }

    // check if valid tier
    const tiers = ["starter", "standard", "advanced"];
    if (!tier || tier.toString().trim() === "") {
        throw new BadRequestError("Service tier is required");
    }
    if (!tiers.includes(tier)) {
        throw new BadRequestError("Invalid tier");
    }

    const selectedTier: "starter" | "standard" | "advanced" = tier;


    // create a contract
    const refs = {
        freelancer: {
            user: service.user._id,
            profile: service.profile._id
        },
        employer: {
            user: profile.user._id,
            profile: profile._id
        }
    }

    const contractInfo = {
        ...refs,
        activityType: "service",
        service: {
            serviceInfo: service._id,
            title: service.title,
            description: service.description,
            tierName: selectedTier,
            tier: service.tier[selectedTier]
        }
    }

    // add stripe payment (add later)
    const employerPaidAmount = service.tier[selectedTier].price;
    console.log({ employerPaidAmount });

    const stripeValidation = true;
    if (!stripeValidation) {
        throw new BadRequestError("Invalid payment");
    }

    const payment = {
        amount: employerPaidAmount,
        employer: {
            status: "paid",
            paidAt: new Date(Date.now()).toString()
        }
    }
    await Contract.create({ ...contractInfo, payments: [payment] });

    // send order service email to the freelancer
    sendOrderServiceEmail({
        email: service.user.email!,
        serviceId: service._id.toString(),
        servicePrice: service.tier[selectedTier].price,
        serviceTitle: service.title,
        tierName: selectedTier,
        userAs: "freelancer"
    });

    // send order service email to the employer
    sendOrderServiceEmail({
        email: profile.user.email!,
        serviceId: service._id.toString(),
        servicePrice: service.tier[selectedTier].price,
        serviceTitle: service.title,
        tierName: selectedTier,
        userAs: "employer"
    });

    res.status(StatusCodes.OK).json({
        title: contractInfo.service.title,
        description: contractInfo.service.description,
        tier: contractInfo.service.tier
    });
}



export {
    getAllservices,
    singleService,
    createService,
    updateService,
    deleteService,
    uploadFeaturedImg,
    uploadGallery,
    orderService
}