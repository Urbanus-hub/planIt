import mongoose, { Schema } from "mongoose";
const messageSchema = new Schema({
    conversation: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sender is required"],
        index: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Receiver is required"],
        index: true,
    },
    content: {
        type: String,
        required: [true, "Message content is required"],
        trim: true,
        maxlength: [5000, "Message cannot exceed 5000 characters"],
    },
    messageType: {
        type: String,
        enum: ["text", "image", "file", "system"],
        default: "text",
    },
    attachments: [
        {
            url: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                enum: ["image", "document", "video"],
                required: true,
            },
            name: String,
        },
    ],
    isRead: {
        type: Boolean,
        default: false,
        index: true,
    },
    readAt: Date,
    isEdited: {
        type: Boolean,
        default: false,
    },
    editedAt: Date,
    relatedBooking: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
    },
}, { timestamps: true });
// Index for finding unread messages
messageSchema.index({ receiver: 1, isRead: 1 });
// Index for conversation messages
messageSchema.index({ conversation: 1, createdAt: -1 });
// Index for getting messages between users
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
const conversationSchema = new Schema({
    participants: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        required: true,
        validate: {
            validator: function (v) {
                return v.length === 2;
            },
            message: "Conversation must have exactly 2 participants",
        },
        index: true,
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
    },
    lastMessageAt: Date,
    unreadCount: {
        type: Map,
        of: Number,
        default: new Map(),
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
    relatedBooking: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
    },
}, { timestamps: true });
// Compound index for finding conversations between specific users
conversationSchema.index({ participants: 1 });
const Message = mongoose.model("Message", messageSchema);
const Conversation = mongoose.model("Conversation", conversationSchema);
export { Message, Conversation };
export default Message;
//# sourceMappingURL=messages.model.js.map