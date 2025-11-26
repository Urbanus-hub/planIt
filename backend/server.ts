import express, { Request, Response } from "express";
import { PORT, CLIENT_URL } from "./configs/env";
import connectDB from "./configs/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import handleGlobalError from "./middlewares/globalErrorsHandler.middleware";
import servicesRouter from "./routes/service.route";
import BookingRouter from "./routes/bookings.route";
import galleryRouter from "./routes/gallery.route";
import http from "http";
import { Server } from "socket.io";
import { Message, Conversation } from "./models/messages.model";

const app = express(); // express app instance

// CORS configuration to allow cookies
app.use(
  cors({
    origin: CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Create HTTP server and initialize Socket.IO with CORS settings
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store active user connections and typing indicators
// Maps userId to socket ID for targeted messaging
const userSockets = new Map<string, string>();
// Maps conversationId to set of active user IDs in that conversation
const activeConversations = new Map<string, Set<string>>();
// Maps conversationId to users currently typing
const typingUsers = new Map<string, Set<string>>();

// routes
app.use("/api/users", userRoutes); // user routes
app.use("/api/services", servicesRouter);
app.use("/api/bookings", BookingRouter);
app.use("/api/gallery", galleryRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is running..." });
});
io.on("connection", (socket) => {
  console.log(`✓ User connected: ${socket.id}`);

  socket.on("user:join", async ({ userId, conversationId }) => {
    try {
      // Verify this is a TWO-PARTY conversation
      const conversation = await Conversation.findById(conversationId);
      if (!conversation || conversation.participants.length !== 2) {
        socket.emit("conversation:error", {
          error: "Invalid conversation: must be between exactly 2 participants",
        });
        return;
      }

      // Verify the user is actually a participant in this conversation
      const isParticipant = conversation.participants.some(
        (p) => p.toString() === userId
      );
      if (!isParticipant) {
        socket.emit("conversation:error", {
          error: "Unauthorized: you are not part of this conversation",
        });
        return;
      }

      // Store the socket ID for this user for direct messaging
      userSockets.set(userId, socket.id);
      // Join user to the conversation room
      socket.join(conversationId);

      // Track active participants in this conversation
      if (!activeConversations.has(conversationId)) {
        activeConversations.set(conversationId, new Set());
      }
      activeConversations.get(conversationId)?.add(userId);

      // Get the OTHER participant (two-party messaging)
      const otherParticipant = conversation.participants.find(
        (p) => p.toString() !== userId
      );

      // Notify the OTHER participant that this user came online
      // This ensures real-time updates between exactly 2 people
      socket.to(conversationId).emit("user:online", {
        userId,
        otherParticipant: otherParticipant?.toString(),
        timestamp: new Date(),
      });

      console.log(
        `👤 User ${userId} joined TWO-PARTY conversation: ${conversationId} (with ${otherParticipant})`
      );
    } catch (error) {
      console.error("Error in user:join:", error);
      socket.emit("conversation:error", {
        error: "Failed to join conversation",
      });
    }
  });

  socket.on(
    "message:send",
    async ({
      conversationId,
      sender,
      receiver,
      content,
      attachments,
      relatedBooking,
    }) => {
      try {
        // Verify this is a TWO-PARTY conversation with exact participants
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || conversation.participants.length !== 2) {
          socket.emit("message:error", {
            error:
              "Invalid conversation: must be between exactly 2 participants",
          });
          return;
        }

        // Validate that sender and receiver are the ONLY two participants
        const participants = conversation.participants.map((p) => p.toString());
        const senderStr = sender.toString();
        const receiverStr = receiver.toString();

        if (
          !participants.includes(senderStr) ||
          !participants.includes(receiverStr)
        ) {
          socket.emit("message:error", {
            error:
              "Unauthorized: sender and receiver must be the conversation participants",
          });
          return;
        }

        // Ensure sender is not messaging themselves
        if (senderStr === receiverStr) {
          socket.emit("message:error", {
            error: "Cannot send message to yourself",
          });
          return;
        }

        // Create and save new message to database
        const newMessage = await Message.create({
          conversation: conversationId,
          sender,
          receiver,
          content,
          messageType: attachments ? "file" : "text",
          attachments,
          relatedBooking,
          isRead: false, // Default to unread
        });

        // Populate sender details for the response
        const populatedMessage = await newMessage.populate(
          "sender",
          "name avatar"
        );

        // Update conversation with the new last message
        await Conversation.updateOne(
          { _id: conversationId },
          {
            lastMessage: newMessage._id,
            lastMessageAt: new Date(),
          }
        );

        // Broadcast message ONLY to this TWO-PARTY conversation room
        // Both sender (acknowledgement) and receiver get the message
        io.to(conversationId).emit("message:receive", {
          _id: populatedMessage._id,
          conversationId,
          sender: populatedMessage.sender,
          receiver,
          content,
          attachments,
          messageType: newMessage.messageType,
          isRead: false,
          createdAt: populatedMessage.createdAt,
        });

        // If receiver is online in THIS conversation, mark as read after short delay
        const receiverSocket = userSockets.get(receiverStr);
        if (
          receiverSocket &&
          activeConversations.get(conversationId)?.has(receiverStr)
        ) {
          setTimeout(async () => {
            await Message.updateOne(
              { _id: newMessage._id },
              { isRead: true, readAt: new Date() }
            );

            // Notify BOTH participants that message was read
            // (important in two-party conversations)
            io.to(conversationId).emit("message:read", {
              messageId: newMessage._id,
              readBy: receiverStr,
              readAt: new Date(),
            });
          }, 1000);
        }

        console.log(
          `📨 TWO-PARTY MESSAGE: ${senderStr} → ${receiverStr} in ${conversationId}`
        );
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("message:error", {
          error: "Failed to send message",
        });
      }
    }
  );

  socket.on("user:typing", ({ userId, conversationId }) => {
    // Track typing user for this conversation
    if (!typingUsers.has(conversationId)) {
      typingUsers.set(conversationId, new Set());
    }
    typingUsers.get(conversationId)?.add(userId);

    // Broadcast typing indicator to other participants (exclude sender)
    socket.to(conversationId).emit("user:typing", {
      userId,
      isTyping: true,
    });

    console.log(`⌨️  User ${userId} is typing in ${conversationId}`);
  });

  socket.on("user:stop-typing", ({ userId, conversationId }) => {
    // Remove user from typing set
    typingUsers.get(conversationId)?.delete(userId);

    // Notify other participants that typing stopped
    socket.to(conversationId).emit("user:stop-typing", {
      userId,
      isTyping: false,
    });

    console.log(`⏸️  User ${userId} stopped typing in ${conversationId}`);
  });

  socket.on("user:leave", ({ userId, conversationId }) => {
    // Remove user from active conversations tracking
    activeConversations.get(conversationId)?.delete(userId);

    // Clear any typing indicators for this user
    typingUsers.get(conversationId)?.delete(userId);

    // Leave the socket room
    socket.leave(conversationId);

    // Notify remaining participants that user is offline
    socket.to(conversationId).emit("user:offline", {
      userId,
      timestamp: new Date(),
    });

    console.log(`👋 User ${userId} left conversation: ${conversationId}`);
  });

  socket.on("disconnect", () => {
    // Find and remove user from all tracked locations
    let disconnectedUserId: string | undefined;

    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        userSockets.delete(userId);
        break;
      }
    }

    // Notify all conversations about the disconnect
    for (const [conversationId, users] of activeConversations.entries()) {
      if (users.has(disconnectedUserId || "")) {
        users.delete(disconnectedUserId || "");
        socket.to(conversationId).emit("user:offline", {
          userId: disconnectedUserId,
          timestamp: new Date(),
        });
      }
    }

    console.log(`✗ User disconnected: ${socket.id} (${disconnectedUserId})`);
  });
});

// global error handler
app.use(handleGlobalError);

// spin server
const port = PORT || 5000;
server.listen(port, async () => {
  await connectDB();
  console.log(`🚀 Server running at http://localhost:${port}`);
});
