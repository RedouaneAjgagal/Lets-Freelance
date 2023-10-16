import { RequestHandler } from "express"
import { StatusCodes } from "http-status-codes"
import { CustomAuthRequest } from "../../middlewares/authentication";
import Profile, { IProfile } from "./profile.model";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import getProfileInfo from "./utils/getProfileInfo";
import getUpdatedProfileInfo from "./helpers/getUpdatedProfileInfo";
import { destroyCookie } from "../../utils/cookies";
import { UploadedFile } from "express-fileupload";
import uploadImage from "../../utils/uploadImage";
import isInvalidConnect from "./validators/buyConnectsValidator";
import stripe from "../../stripe/stripeConntect";
import transferToStripeAmount from "../../stripe/utils/transferToStripeAmount";


//@desc get current user profile
//@route GET /api/v1/profile
//@access authentication
const profileInfo: RequestHandler = async (req: CustomAuthRequest, res) => {
    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "email role" });
    if (!profile) {
        throw new UnauthenticatedError("Cannot find any profile");
    }
    const profileInfo = getProfileInfo(profile.toObject());
    res.status(StatusCodes.OK).json(profileInfo);
}


//@desc get signle profile info 
//@route GET /api/v1/profile/:profileId
//@access public

type GeneralDummyDetails = {
    rating: number;
    completedJobs: { title: string; content: string; rate: number; startDate: string; endDate: string }[];
}

type Freelancer = {
    serviceDetail: {
        projectSuccess: number;
        totalService: number;
        completedService: number;
        inQueueService: number;
    };
    services: {
        _id: string;
        img: string;
        category: string;
        title: string;
        rate: number;
        reviews: number;
        user: {
            img: string;
            name: string;
        };
        price: number;
    }[];
    inProgressJobs: {
        title: string,
        startDate: string
    }[];
}

type Employer = {
    openJobs: {
        _id: string;
        title: string;
        location: string;
        category: string;
        price: { start: number; end: number } | number;
        jobType: string;
        employer: {
            name: string;
        }
    }[]
}

const singleProfile: RequestHandler = async (req, res) => {
    const { profileId } = req.params;
    const profile = await Profile.findById(profileId).populate({ path: "user", select: "role" }).select("-roles.freelancer.connects");
    if (!profile) {
        throw new NotFoundError("Found no profile");
    }


    let additionalDummyData: GeneralDummyDetails & Partial<Freelancer | Employer> = {
        rating: 5,
        completedJobs: [
            {
                title: "Fix bugs in my website",
                content:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi tempora voluptatem sunt dolorum vel voluptates harum excepturi unde atque a? Consectetur aperiam accusantium obcaecati praesentium quo! Necessitatibus accusantium nihil dolor.",
                rate: 5,
                startDate: "2023-08-01T00:00:00.000Z",
                endDate: "2023-08-08T00:00:00.000Z"
            },
            {
                title: "Create an admin dashboard",
                content:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi tempora voluptatem sunt dolorum vel voluptates harum excepturi unde atque a?",
                rate: 4.4,
                startDate: "2023-02-03T00:00:00.000Z",
                endDate: "2023-05-16T00:00:00.000Z"
            }
        ],
    }

    if (profile.userAs === "freelancer") {
        additionalDummyData = {
            ...additionalDummyData,
            serviceDetail: {
                projectSuccess: 2,
                totalService: 5,
                completedService: 1,
                inQueueService: 11,
            },
            services: [
                {
                    _id: "1",
                    img: "https://demoapus1.com/freeio/wp-content/uploads/2022/11/service13-495x370.jpg",
                    category: "programming & tech",
                    title: "Management software to help you manage your mobile",
                    rate: 4.5,
                    reviews: 1,
                    user: {
                        img: "https://res.cloudinary.com/dqfrgtxde/image/upload/v1691242924/avatars_lets-freelance/avyqe1mnd4lzpjmbjlf7.webp",
                        name: "user demo"
                    },
                    price: 89
                },
                {
                    _id: "2",
                    img: "https://demoapus1.com/freeio/wp-content/uploads/2022/11/service12-495x370.jpg",
                    category: "design & creative",
                    title: "Developers dron the framework folder into a new parent",
                    rate: 4.8,
                    reviews: 3,
                    user: {
                        img: "https://res.cloudinary.com/dqfrgtxde/image/upload/v1691242924/avatars_lets-freelance/avyqe1mnd4lzpjmbjlf7.webp",
                        name: "user demo"
                    },
                    price: 128
                }
            ],
            inProgressJobs: [
                {
                    title: "React developer for medical startup",
                    startDate: "2023-08-09T00:00:00.000Z"
                },
                {
                    title: "Build discord chat bot",
                    startDate: "2023-06-23T00:00:00.000Z"
                }
            ]
        }
    }

    if (profile.userAs === "employer") {
        additionalDummyData = {
            ...additionalDummyData,
            openJobs: [
                {
                    _id: "1",
                    title: "English content writer for college",
                    location: "Los Angeles",
                    category: "writing & translation",
                    price: 125,
                    jobType: "part time",
                    employer: {
                        name: "employer demo"
                    }
                },
                {
                    _id: "2",
                    title: "Food delivery mobile app on IOS and Android",
                    location: "New York",
                    category: "programming & tech",
                    price: { start: 15, end: 25 },
                    jobType: "full time",
                    employer: {
                        name: "employer demo"
                    }
                }
            ],

        }
    }

    const profileInfo = getProfileInfo(profile.toObject());

    res.status(StatusCodes.OK).json({ ...profileInfo, ...additionalDummyData });
}


//@desc upload profile avatar
//@route POST /api/v1/profile
//@access authentication
const uploadAvatar: RequestHandler = async (req: CustomAuthRequest, res) => {
    const imageFile = req.files?.avatar as UploadedFile;
    const maxSize = 1024 * 1024;
    const imageResponse = await uploadImage({
        folderName: "avatars_lets-freelance",
        imageFile,
        maxSize
    });

    res.status(StatusCodes.OK).json({ avatarURL: imageResponse.secure_url });
}


//@desc update profile
//@route PATCH /api/v1/profile
//@access authentication
const updateProfile: RequestHandler = async (req: CustomAuthRequest, res) => {
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Cannot find any profile");
    }


    // switch roles between freelancer and employer
    const isSwitichingRole: { userAs: IProfile["userAs"] } | undefined = req.body.switchRole;
    if (isSwitichingRole && isSwitichingRole.userAs && (isSwitichingRole.userAs === "employer" || isSwitichingRole.userAs === "freelancer")) {
        await profile.updateOne({ userAs: isSwitichingRole.userAs });
        return res.status(StatusCodes.OK).json({ msg: `Profile now is ${isSwitichingRole.userAs}` });
    }


    // get the correct updated profile info
    const updatedProfileInfo = getUpdatedProfileInfo({
        newProfileInfo: req.body.profileInfo || {},
        roles: profile.roles,
        userAs: profile.userAs
    });

    await profile.updateOne(updatedProfileInfo);

    res.status(StatusCodes.OK).json({ msg: "Profile has been updated" });
}


//@desc delete current user profile
//@route DELETE /api/v1/profile
//@access authentication
const deleteProfile: RequestHandler = async (req: CustomAuthRequest, res) => {
    // find profile
    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "role" });

    if (!profile) {
        throw new UnauthenticatedError("Found no profile");
    }

    // unable to delete owner roles
    if (profile.user.role === "owner") {
        throw new BadRequestError("Owner roles cannot be deleted");
    }

    // delete profile
    await profile.deleteOne();

    // destroy auth cookie
    destroyCookie(res);

    res.status(StatusCodes.OK).json({ msg: "Your account has been deleted permanently" });
}


//@desc delete single profile
//@route DELETE /api/v1/profile/:profileId
//@access authorization
const deleteSingleProfile: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { profileId } = req.params;
    if (!profileId || profileId.trim() === "") {
        throw new BadRequestError("Must provide a profile id");
    }

    // find the target profile
    const ressourceProfile = await Profile.findById(profileId).populate({ path: "user", select: "role" });
    if (!ressourceProfile) {
        throw new NotFoundError("Found no profile");
    }

    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "role" });
    if (!profile) {
        throw new UnauthenticatedError("Found no profile");
    }

    // check if its the current user profile
    if (ressourceProfile._id.toString() === profile._id.toString()) {
        throw new BadRequestError("Cannot delete your account");
    }

    // only delete users but owner can delete any
    if (ressourceProfile.user.role !== "user" && profile.user.role !== "owner" || ressourceProfile.user.role === "owner") {
        throw new UnauthorizedError(`You dont have access to delete ${ressourceProfile.user.role} roles.`);
    }

    // delete profile
    await ressourceProfile.deleteOne();

    res.status(StatusCodes.OK).json({ msg: "Account has been deleted" });
}


//@desc buy connects for freelancers
//@route POST /api/v1/profile/connects
//@access authentication (freelancers only)
const buyConnects: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { connects } = req.body;

    // check if valid connects value
    const invalidConnects = isInvalidConnect(connects);
    if (invalidConnects) {
        throw new BadRequestError(invalidConnects);
    }

    // find profile
    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "email" });
    if (!profile) {
        throw new UnauthorizedError("Found no user");
    }

    // check if profile is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("Only freelancers have access to buy connects");
    }

    // get connect product
    const connectProduct = await stripe.products.retrieve("prod_OpXMa2pFYUTp65");

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        currency: "usd",
        client_reference_id: profile.user._id.toString(),
        line_items: [
            {
                price: connectProduct.default_price!.toString(), // 0.5 usd
                quantity: connects
            }
        ],
        success_url: `http://localhost:5000/api/v1/profiles/connects?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: "http://localhost:5173",
        customer_email: profile.user.email,
        metadata: {
            freelancerId: profile.user._id.toString(),
            connects
        }
    });

    console.log(session.url);

    profile.roles.freelancer!.connects.payments.push({
        status: "pending",
        sessionId: session.id,
        connectionsCount: connects
    });

    await profile.save();

    res.redirect(session.url!);
}


//@desc set connects to paid and increase profile connects
//@route PATCH /api/v1/profile/connects
//@access authentication (freelancers only)
const setPaidConnects: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { session_id } = req.query;

    if (!session_id) {
        throw new BadRequestError("Session ID is required");
    }

    // find profile
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthorizedError("Found no user");
    }

    // check if the user is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("Must be a freelancer");
    }

    // find the payment
    const payment = profile.roles.freelancer!.connects.payments.find(payment => payment.sessionId === session_id);
    if (!payment) {
        throw new BadRequestError(`Found no payment with session ID ${session_id}`);
    }

    // check if the payment is at pending status
    if (payment.status !== "pending") {
        throw new BadRequestError("Only pending payments are valid to set as paid");
    }

    // find session
    const session = await stripe.checkout.sessions.retrieve(payment.sessionId);
    if (!session) {
        throw new BadRequestError(`Found no session with ID ${payment.sessionId}`);
    }

    // check if the session has been paid
    if (session.payment_status !== "paid") {
        throw new BadRequestError("Must pay the connects first");
    }

    // set payment description to connect purchase
    const paymentIntent = await stripe.paymentIntents.update(session.payment_intent!.toString(), {
        description: "Connect Purchase",
        metadata: {
            freelancerId: profile.user._id.toString()
        }
    });

    // set new values
    payment.status = "paid";
    payment.amountPaid = session.amount_total! / 100;
    payment.connectionsCount = Number(session.metadata!.connects);
    payment.paidAt = new Date(paymentIntent.created * 1000).toString();
    profile.roles.freelancer!.connects.connectionsCount += Number(session.metadata!.connects);

    await profile.save();


    res.status(StatusCodes.OK).json({ msg: `You have bought ${session.metadata!.connects} connects successfully` });
}

export {
    profileInfo,
    singleProfile,
    uploadAvatar,
    updateProfile,
    deleteProfile,
    deleteSingleProfile,
    buyConnects,
    setPaidConnects
}