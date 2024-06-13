import mongoose from "mongoose";
import { IUser } from "../auth";

export type MessageSchemaType = {
    user: {
        _id: mongoose.Types.ObjectId;
    } & Partial<IUser>;
    receiver: {
        _id: mongoose.Types.ObjectId;
    } & Partial<IUser>;
    content: string;
    delivered: boolean;
};

const messageSchema = new mongoose.Schema<MessageSchemaType>({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: "User",
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