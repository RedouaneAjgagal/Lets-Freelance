import mongoose from "mongoose";
import { IUser } from "../auth";
import { IProfile } from "../profile";

export type MessageTypeRequiedValues = {
    receiverId: {
        _id: mongoose.Types.ObjectId;
    } & Partial<IProfile>;
    content: string;
    delivered: boolean;
};

export type MessageSchemaType = {
    user: {
        _id: mongoose.Types.ObjectId;
    } & Partial<IUser>;
    profile: {
        _id: mongoose.Types.ObjectId;
    } & Partial<IProfile>;
} & MessageTypeRequiedValues;

const messageSchema = new mongoose.Schema<MessageSchemaType>({
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
    receiverId: {
        type: mongoose.Types.ObjectId,
        ref: "Profile",
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 3000
    },
    delivered: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
});

const Message = mongoose.model("Message", messageSchema);

export default Message;