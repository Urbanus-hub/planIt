import express, { Request, Response } from "express";
import { PORT } from "./configs/env.js";
import connectDB from "./configs/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import handleGlobalError from "./middlewares/globalErrorsHandler.middleware.js";
import servicesRouter from "./routes/service.route.js";
import BookingRouter from "./routes/bookings.route.js";
import galleryRouter from "./routes/gallery.route.js";
import conversationsRouter from "./routes/conversations.route.js";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./configs/env.js";
import { Message, Conversation } from "./models/messages.model.js";
const app = express(); // express app instance

// CORS configuration to allow cookies
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
  })
);

// middlewares
// Increase payload size limit for file uploads (50MB for base64-encoded videos)
// Note: Base64 encoding increases file size by ~33%, so 23MB video becomes ~31MB
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Create HTTP server and initialize Socket.IO with CORS settings
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true, // Allow all origins
    methods: ["GET", "POST"],
    credentials: true,
  },
  // Additional Socket.IO configuration for better stability
  transports: ["polling", "websocket"],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  maxHttpBufferSize: 1e6, // 1MB
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
app.use("/api/conversations", conversationsRouter);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API is running..." });
});

// Add global error handling for Socket.IO
io.engine.on("connection_error", (err) => {
  console.log("Socket.IO connection error:", err.req);
  console.log("Error code:", err.code);
  console.log("Error message:", err.message);
  console.log("Error context:", err.context);
});

io.on("connection", (socket) => {
  console.log(`✓ User connected: ${socket.id}`);

  // Try to read auth token from the socket handshake cookies (httpOnly cookies)
  const cookieHeader = socket.handshake.headers?.cookie || "";
  const parseCookies = (cookieString: string) =>
    cookieString.split("; ").reduce((acc: Record<string, string>, cur) => {
      const [k, ...v] = cur.split("=");
      if (!k) return acc;
      acc[k] = decodeURIComponent(v.join("="));
      return acc;
    }, {});

  const cookies = parseCookies(cookieHeader || "");
  const token =
    socket.handshake.auth?.token || cookies.authToken || cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      // Attach minimal user info to socket
      socket.data.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
      console.log(
        `🔐 User connected with token (userId=${decoded.id}): ${socket.id}`
      );
    } catch (err) {
      console.log(`⚠️ Invalid token on socket connection: ${socket.id}`);
    }
  } else {
    console.log(`⚠️ User connected without auth token: ${socket.id}`);
  }

  // Handle disconnection with better logging
  socket.on("disconnect", (reason) => {
    console.log(`✗ User disconnected: ${socket.id} (${reason})`);

    // Clean up user from maps
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);

        // Clean up from active conversations
        if (socket.data.currentConversation) {
          activeConversations
            .get(socket.data.currentConversation)
            ?.delete(userId);

          // Notify others in the conversation that user went offline
          socket.to(socket.data.currentConversation).emit("user:offline", {
            userId,
            timestamp: new Date(),
          });
        }

        // Broadcast offline status to ALL conversations this user is part of
        Conversation.find({ participants: userId, isActive: true })
          .then((conversations) => {
            conversations.forEach((conv: any) => {
              socket.to(conv._id.toString()).emit("user:offline", {
                userId,
                timestamp: new Date(),
              });
              // Clean up from active conversations tracking
              activeConversations.get(conv._id.toString())?.delete(userId);
            });
          })
          .catch((err) =>
            console.error("Error broadcasting offline status:", err)
          );

        console.log(`🧹 Cleaned up user mapping: ${userId}`);
        break;
      }
    }
  });

  socket.on("connect_error", (error) => {
    console.error(`❌ Connection error for ${socket.id}:`, error);
  });

  socket.on("error", (error) => {
    console.error(`❌ Socket error for ${socket.id}:`, error);
  });

  // Handle transport errors
  socket.conn.on("error", (error) => {
    console.log(`⚠️ Transport error for ${socket.id}:`, error.message);
  });

  // Track user's current conversation to prevent duplicate joins
  socket.data.currentConversation = null;

  socket.on("user:join", async ({ userId, conversationId }) => {
    console.log(
      `🏠 User ${userId} attempting to join conversation: ${conversationId}`
    );

    try {
      // Validate required parameters
      if (!userId) {
        socket.emit("conversation:error", {
          error: "User ID is required to join conversation",
        });
        return;
      }

      if (!conversationId) {
        socket.emit("conversation:error", {
          error: "Conversation ID is required",
        });
        return;
      }

      // Prevent duplicate joins to the same conversation
      if (socket.data.currentConversation === conversationId) {
        console.log(
          `⏭️ User ${userId} already in conversation ${conversationId}, skipping`
        );
        socket.emit("conversation:joined", {
          conversationId,
          userId,
          message: "Already in conversation",
        });
        return;
      }

      // Check if conversationId is a valid ObjectId format
      if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        console.log(`❌ Invalid conversation ID format: ${conversationId}`);
        socket.emit("conversation:error", {
          error:
            "Invalid conversation ID format. Please create a conversation first.",
        });
        return;
      }

      // Verify this is a TWO-PARTY conversation
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        console.log(`❌ Conversation not found: ${conversationId}`);
        socket.emit("conversation:error", {
          error: "Conversation not found",
        });
        return;
      }

      if (conversation.participants.length !== 2) {
        console.log(
          `❌ Invalid conversation participants: ${conversation.participants.length}`
        );
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
        console.log(
          `❌ User ${userId} is not a participant in conversation ${conversationId}`
        );
        socket.emit("conversation:error", {
          error: "Unauthorized: you are not part of this conversation",
        });
        return;
      }

      // Leave previous conversation if any
      if (socket.data.currentConversation) {
        const prevConversation = socket.data.currentConversation;
        socket.leave(prevConversation);
        activeConversations.get(prevConversation)?.delete(userId);
        console.log(
          `👋 User ${userId} left previous conversation: ${prevConversation}`
        );
      }

      // Store the socket ID for this user for direct messaging
      userSockets.set(userId, socket.id);

      // Join user to the new conversation room
      socket.join(conversationId);
      socket.data.currentConversation = conversationId;

      console.log(
        `✅ User ${userId} successfully joined conversation: ${conversationId}`
      );

      // Send confirmation back to client
      socket.emit("conversation:joined", {
        conversationId,
        userId,
        message: "Successfully joined conversation",
      });

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

      // Also broadcast to ALL conversations this user is part of
      // This ensures online status is visible across all conversations
      const userConversations = await Conversation.find({
        participants: userId,
        isActive: true,
      });

      userConversations.forEach((conv: any) => {
        if (conv._id.toString() !== conversationId) {
          socket.to(conv._id.toString()).emit("user:online", {
            userId,
            timestamp: new Date(),
          });
        }
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
      console.log(`🎯 RECEIVED MESSAGE:SEND EVENT:`);
      console.log(`   - Conversation: ${conversationId}`);
      console.log(`   - Sender: ${sender}`);
      console.log(`   - Receiver: ${receiver}`);
      console.log(`   - Content: "${content}"`);
      console.log(`   - Socket ID: ${socket.id}`);

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
