import { Router, Request, Response } from "express";
import { Conversation, Message } from "../models/messages.model";
import User from "../models/user.model";
import authorize from "../middlewares/authorize.middleware";

const router = Router();

// Test endpoint (no auth required)
router.get("/test", (_req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "Conversations API is working",
    timestamp: new Date().toISOString(),
  });
});

// Apply authentication middleware to protected routes
router.use(authorize);

/**
 * Get or create a conversation between two users
 * POST /api/conversations/create
 */
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { participantId } = req.body;
    const currentUserId = req.user?.id; // Get user ID from JWT payload

    if (!currentUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!participantId) {
      return res.status(400).json({ message: "Participant ID is required" });
    }

    // Validate participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    // Check if conversation already exists between these users
    let conversation = await Conversation.findOne({
      participants: {
        $all: [currentUserId, participantId],
        $size: 2,
      },
    }).populate("participants", "name email avatar role");

    let isNewConversation = false;

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants: [currentUserId, participantId],
        unreadCount: new Map([
          [currentUserId.toString(), 0],
          [participantId, 0],
        ]),
      });
      await conversation.save();
      await conversation.populate("participants", "name email avatar role");
      isNewConversation = true;

      console.log(
        `✅ New conversation created between ${currentUserId} and ${participantId}: ${conversation._id}`
      );
    } else {
      console.log(
        `🔍 Existing conversation found between ${currentUserId} and ${participantId}: ${conversation._id}`
      );
    }

    return res.status(200).json({
      success: true,
      conversation,
      isNew: isNewConversation,
      message: isNewConversation
        ? "New conversation created"
        : "Existing conversation retrieved",
    });
  } catch (error) {
    console.error("Error creating/finding conversation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Get user's conversations
 * GET /api/conversations/user/:userId
 */
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.id;

    // Ensure user can only get their own conversations
    if (currentUserId?.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const conversations = await Conversation.find({
      participants: userId,
      isActive: true,
    })
      .populate("participants", "name email avatar role")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1, updatedAt: -1 });

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Get messages in a conversation
 * GET /api/conversations/:conversationId/messages
 */
router.get("/:conversationId/messages", async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify user is participant in this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === currentUserId.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    return res.status(200).json({
      success: true,
      messages: messages.reverse(), // Reverse to show oldest first
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Mark messages as read
 * PATCH /api/conversations/:conversationId/read
 */
router.patch("/:conversationId/read", async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: conversationId,
        receiver: currentUserId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    // Update unread count in conversation
    const conversation = await Conversation.findById(conversationId);
    if (conversation) {
      conversation.unreadCount.set(currentUserId.toString(), 0);
      await conversation.save();
    }

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
