import mongoose, { Document, Types } from "mongoose";
export interface IMessage extends Document {
    conversation: Types.ObjectId;
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    content: string;
    messageType: "text" | "image" | "file" | "system";
    attachments?: {
        url: string;
        type: "image" | "document" | "video";
        name?: string;
    }[];
    isRead: boolean;
    readAt?: Date;
    isEdited: boolean;
    editedAt?: Date;
    relatedBooking?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export interface IConversation extends Document {
    participants: Types.ObjectId[];
    lastMessage?: Types.ObjectId;
    lastMessageAt?: Date;
    unreadCount: Map<string, number>;
    isActive: boolean;
    relatedBooking?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Message: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}, {}> & IMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
declare const Conversation: mongoose.Model<IConversation, {}, {}, {}, mongoose.Document<unknown, {}, IConversation, {}, {}> & IConversation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export { Message, Conversation };
export default Message;
//# sourceMappingURL=messages.model.d.ts.map