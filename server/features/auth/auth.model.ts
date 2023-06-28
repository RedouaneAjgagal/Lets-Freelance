import mongoose from "mongoose";
import hashData from "../../utils/hashData";
import compareData from "../../utils/compareData";

interface IUser {
    _id: typeof mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    verificationToken: string | null;
    verifiedDate: Date | null;
    resetPasswordToken: string | null;
    passwordTokenExpirationDate: Date | null;
    role: "user" | "admin" | "owner";
    userAs: "freelancer" | "employee";
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (unhashedPassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        minLength: [3, "Name cannot be less than 3 characters."],
        maxLength: [20, "Name cannot be more than 20 characters."],
        required: [true, "Name is required."]
    },
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
    userAs: {
        type: String,
        enum: {
            values: ["freelancer", "employee"]
        },
        default: "freelancer",
        required: true
    }
}, { timestamps: true });

userSchema.methods.comparePassword = async function (unhashedPassword: string) {
    const isValidPassword = await compareData(unhashedPassword, this.password);
    return isValidPassword;
}

userSchema.pre("save", async function () {
    if (this.isNew || this.isModified("password")) {
        // hash password
        const hashedPassword = await hashData(this.password, 10);
        this.password = hashedPassword;
        return;
    }
});

const User = mongoose.model("User", userSchema);


export default User;