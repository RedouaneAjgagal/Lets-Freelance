import mongoose from "mongoose";
import hashData from "../../utils/hashData";
import compareData from "../../utils/compareData";
import { Profile } from "../profile";
import { IProfile } from "../profile/profile.model";

type Stripe = {
    id: string;
    defaultCurrency: string;
    banksInfo: BankInfo[]
}
export type BankInfoWithoutId = {
    isDefault: boolean;
    bankAccountId: string;
    accountLastFour: string;
    country: string;
    currency: string;
}
export type BankInfo = BankInfoWithoutId & { _id: typeof mongoose.Types.ObjectId }

export interface IUser {
    email: string;
    password: string;
    isVerified: boolean;
    verificationToken: string | null;
    verifiedDate: Date | null;
    changeEmailToken: string | null;
    changeEmailTokenExpirationDate: Date | null;
    resetPasswordToken: string | null;
    passwordTokenExpirationDate: Date | null;
    role: "user" | "admin" | "owner";
    stripe: Stripe;
    createdAt: Date;
    updatedAt: Date;
    profile?: {
        _id: mongoose.Types.ObjectId;
    } & Partial<IProfile>;
    comparePassword: (unhashedPassword: string) => Promise<boolean>;
    createProfile: ({ userAs, name }: { userAs: "freelancer" | "employer", name: string }) => Promise<void>
}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: [true, "Email is required."],
        validate: {
            validator: function (value: string) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
            },
            message: (props: { value: string }) => `${props.value} is not a valid email.`
        },
        unique: true
    },
    password: {
        type: String,
        minLength: [6, "Password cannot be less than 6 characters."],
        maxLength: [60, "Password cannot be more than 60 characters"],
        required: [true, "Password is required."]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    verifiedDate: {
        type: Date,
        default: null
    },
    changeEmailToken: {
        type: String,
        default: null
    },
    changeEmailTokenExpirationDate: {
        type: Date,
        default: null
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    passwordTokenExpirationDate: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        enum: {
            values: ["user", "admin", "owner"]
        },
        default: "user",
        required: true
    },
    stripe: {
        id: {
            type: String
        },
        defaultCurrency: {
            type: String
        },
        banksInfo: [
            {
                isDefault: {
                    type: Boolean,
                    default: false
                },
                bankAccountId: {
                    type: String
                },
                accountLastFour: {
                    type: String,
                    minlength: 4,
                    maxlength: 4
                },
                country: {
                    type: String
                },
                currency: {
                    type: String
                }
            }
        ]
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.virtual("profile", {
    ref: "Profile",
    localField: "_id",
    foreignField: "user",
    justOne: true
})

userSchema.methods.comparePassword = async function (unhashedPassword: string) {
    const isValidPassword = await compareData(unhashedPassword, this.password);
    return isValidPassword;
}

userSchema.methods.createProfile = async function ({ userAs, name }: { userAs: "freelancer" | "employer", name: string }) {
    const avatar = `https://ui-avatars.com/api/?name=${name}&background=random`;
    const profileInfo = {
        user: this._id,
        name,
        avatar,
        userAs
    }
    await Profile.create(profileInfo);
}

userSchema.pre("save", async function () {
    // hash password
    if (this.isNew || this.isModified("password")) {
        const hashedPassword = await hashData(this.password, 10);
        this.password = hashedPassword;
        return;
    }
});

const User = mongoose.model("User", userSchema);


export default User;