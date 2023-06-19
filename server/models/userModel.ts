import mongoose from "mongoose";

interface IUser {
    _id: typeof mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    verificationToken: string;
    verifiedDate: Date | null;
    resetPasswordToken: string | null;
    passwordTokenExpirationDate: Date | null;
    role: null | "freelancer" | "client" | "admin" | "owner";
    createdAt: Date;
    updatedAt: Date;
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
            values: ["freelancer", "client", "admin", "owner"]
        },
        default: null
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);


export default User;