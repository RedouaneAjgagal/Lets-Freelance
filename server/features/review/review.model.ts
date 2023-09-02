import mongoose from "mongoose";

export type ReviewWithoutRefs = {
    activityType: "service" | "job";
    activityTitle: string;
    rating: number;
    description: string;
}

export type Review = {
    user: {
        _id: mongoose.Types.ObjectId;
    };
    profile: {
        _id: mongoose.Types.ObjectId;
    };
    service: {
        _id: mongoose.Types.ObjectId;
    } | undefined;
    job: {
        _id: mongoose.Types.ObjectId;
    } | undefined;
} & ReviewWithoutRefs;

const reviewSchema = new mongoose.Schema<Review>({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    profile: {
        type: mongoose.Types.ObjectId,
        ref: "Profile",
        required: true
    },
    service: {
        type: mongoose.Types.ObjectId,
        ref: "Service"
    },
    job: {
        type: mongoose.Types.ObjectId,
        ref: "Job"
    },
    activityType: {
        type: String,
        enum: {
            values: ["service", "job"],
            message: "{value} is not supported"
        },
        required: true
    },
    activityTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        maxlength: [2000, "Review cannot be more than 2000 characters"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }
}, {
    timestamps: true
});

reviewSchema.index({ user: 1, service: 1, job: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;