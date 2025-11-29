import mongoose, { Document, Schema, Types } from "mongoose";

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
  relatedBooking?: Types.ObjectId; // Reference to booking if discussing an order
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
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
  },
  { timestamps: true }
);

// Index for finding unread messages
messageSchema.index({ receiver: 1, isRead: 1 });
// Index for conversation messages
messageSchema.index({ conversation: 1, createdAt: -1 });
// Index for getting messages between users
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  lastMessageAt?: Date;
  unreadCount: Map<string, number>; // userId -> unread count
  isActive: boolean;
  relatedBooking?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: true,
      validate: {
        validator: function (v: Types.ObjectId[]) {
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
  },
  { timestamps: true }
);

// Compound index for finding conversations between specific users
conversationSchema.index({ participants: 1 });

const Message = mongoose.model<IMessage>("Message", messageSchema);
const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export { Message, Conversation };
export default Message;
