import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    location: {
        country: String,
        city: String,
    },
    phoneNumber: Number,
    showProfile: {
        type: Boolean,
        default: true,
        required: true
    },
    userAs: {
        type: String,
        enum: ["freelancer", "employer"],
        default: "freelancer",
        required: true
    },
    category: {
        type: String,
        enum: ["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"]
    },
    description: {
        type: String,
        maxLength: 1000
    },
    roles: {
        freelancer: {
            dateOfBirth: Date,
            hourlyRate: Number,
            jobTitle: String,
            skills: Array,
            portfolio: String,
            gender: {
                type: String,
                enum: ["male", "female"],
                default: "male",
                required: true
            },
            englishLevel: {
                type: String,
                enum: ["basic", "conversational", "fluent", "native", "professional"],
                default: "conversational",
                required: true
            },
            types: {
                type: String,
                enum: ["agency freelancers", "independent freelancers", "single freelancer"],
                default: "single freelancer",
                required: true
            }
        },
        employer: {
            company: String,
            website: String,
            employees: {
                type: Number,
                default: 0
            }
        }
    }
}, { timestamps: true });

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;