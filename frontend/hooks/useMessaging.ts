"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { initSocket } from "@/lib/socketConfig";
import { Socket } from "socket.io-client";

export interface IMessage {
  _id: string;
  conversationId: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  receiver: string;
  content: string;
  messageType: "text" | "image" | "file" | "system";
  attachments?: {
    url: string;
    type: "image" | "document" | "video";
    name?: string;
  }[];
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface IConversation {
  _id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: Map<string, number>;
  isActive: boolean;
  relatedBooking?: string;
}

interface UseMessagingOptions {
  userId: string;
  conversationId?: string;
  onMessageReceived?: (message: IMessage) => void;
  onTyping?: (data: { userId: string; isTyping: boolean }) => void;
  onUserOnline?: (data: { userId: string; timestamp: Date }) => void;
  onMessageRead?: (data: { messageId: string; readAt: Date }) => void;
}

/**
 * FIXED: Prevents messages from reloading by using proper listener cleanup
 * and functional setState to avoid stale closures
 */
export const useMessaging = ({
  userId,
  conversationId,
  onMessageReceived,
  onTyping,
  onUserOnline,
  onMessageRead,
}: UseMessagingOptions) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users, setUsers] = useState<Map<string, boolean>>(new Map());
  const currentConversationIdRef = useRef<string | undefined>(undefined);
  const connectionAttempts = useRef(0);
  const maxConnectionAttempts = 5;

  /**
   * FIX #1: Initialize socket ONCE with empty dependency array
   */
  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ Socket.IO not initialized: userId is required");
      return;
    }

    console.log(`🔄 Initializing socket for user: ${userId}`);
    socketRef.current = initSocket();

    const socket = socketRef.current;

    socket.on("connect", () => {
      setIsConnected(true);
      connectionAttempts.current = 0; // Reset attempts on successful connection
      console.log("✓ Socket connected");
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      console.log(`✗ Socket disconnected (${reason})`);
    });

    socket.on("connect_error", (error) => {
      const errorMessage = error?.message || "Unknown error";

      connectionAttempts.current += 1;

      // Only log timeout errors once as a warning, not as errors
      if (errorMessage.includes("timeout")) {
        if (connectionAttempts.current === 1) {
          console.warn(
            "⚠️ Real-time messaging unavailable - continuing in offline mode"
          );
        }
        setIsConnected(false);
        return;
      }

      // Only log non-timeout errors
      if (connectionAttempts.current <= 3) {
        console.error("❌ Connection error:", errorMessage);
      }
      setIsConnected(false);
    });

    return () => {
      console.log("🧹 Cleaning up socket connection");
      if (socket.connected) {
        socket.disconnect();
      }
      // Clear all timeouts
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (messageUpdateTimeoutRef.current) {
        clearTimeout(messageUpdateTimeoutRef.current);
      }
    };
  }, [userId]);

  /**
   * FIX #2: Setup listeners ONCE with proper cleanup
   * This prevents duplicate listeners that cause message reloading
   */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    console.log("📡 Setting up socket listeners");

    // FIX: Use functional setState to avoid stale closures
    const handleMessageReceive = (message: IMessage) => {
      console.log(
        "⚡ Message received:",
        message._id,
        "from:",
        message.sender._id,
        "current user:",
        userId
      );

      // Only add messages for the current conversation to prevent cross-conversation pollution
      if (message.conversationId === currentConversationIdRef.current) {
        // Don't add messages from current user via receive handler - they're handled optimistically
        if (message.sender._id === userId) {
          console.log(
            "📤 Ignoring own message from receive handler (handled optimistically)"
          );
        } else {
          setMessages((prev) => {
            // Prevent duplicates
            if (prev.some((m) => m._id === message._id)) {
              console.log("⚠️ Duplicate message ignored:", message._id);
              return prev;
            }
            console.log(
              "📥 Adding received message from other user:",
              message._id
            );
            return [...prev, message];
          });
        }
      }

      onMessageReceived?.(message);
    };

    const handleMessageConfirmed = (data: {
      tempId: string;
      message: IMessage;
    }) => {
      console.log("✅ Message confirmed:", data.tempId, "→", data.message._id);

      setMessages((prev) => {
        const updated = prev.map((msg) => {
          if (msg._id === data.tempId) {
            console.log(
              "🔄 Replacing optimistic message:",
              data.tempId,
              "with confirmed:",
              data.message._id
            );
            return data.message;
          }
          return msg;
        });
        return updated;
      });
    };

    const handleUserOnline = (data: { userId: string; timestamp: Date }) => {
      console.log("🟢 User online:", data.userId);
      setUsers((prev) => {
        const newMap = new Map(prev);
        newMap.set(data.userId, true);
        return newMap;
      });
      onUserOnline?.(data);
    };

    const handleUserOffline = (data: { userId: string; timestamp: Date }) => {
      console.log("🔴 User offline:", data.userId);
      setUsers((prev) => {
        const newMap = new Map(prev);
        newMap.set(data.userId, false);
        return newMap;
      });
    };

    const handleTyping = (data: {
      userId: string;
      isTyping: boolean;
      conversationId?: string;
    }) => {
      // Only handle typing for current conversation
      if (data.conversationId === currentConversationIdRef.current) {
        onTyping?.(data);
      }
    };

    const handleMessageRead = (data: { messageId: string; readAt: Date }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId
            ? { ...msg, isRead: true, readAt: data.readAt }
            : msg
        )
      );
      onMessageRead?.(data);
    };

    // Register all listeners
    socket.on("message:receive", handleMessageReceive);
    socket.on("message:confirmed", handleMessageConfirmed);
    socket.on("user:online", handleUserOnline);
    socket.on("user:offline", handleUserOffline);
    socket.on("user:typing", handleTyping);
    socket.on("message:read", handleMessageRead);

    // FIX: Critical cleanup - remove ALL listeners on unmount
    return () => {
      console.log("🧹 Removing socket listeners");
      socket.off("message:receive", handleMessageReceive);
      socket.off("message:confirmed", handleMessageConfirmed);
      socket.off("user:online", handleUserOnline);
      socket.off("user:offline", handleUserOffline);
      socket.off("user:typing", handleTyping);
      socket.off("message:read", handleMessageRead);
    };
  }, []); // Empty deps - setup once!

  /**
   * FIX #3: Join/leave conversations properly
   */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket?.connected || !conversationId || !userId) {
      return;
    }

    // Skip if already in this conversation
    if (currentConversationIdRef.current === conversationId) {
      return;
    }

    // Leave previous conversation and cleanup typing
    if (currentConversationIdRef.current) {
      console.log(`👋 Leaving: ${currentConversationIdRef.current}`);

      // Stop typing in previous conversation
      if (isTyping) {
        socket.emit("user:stop-typing", {
          userId,
          conversationId: currentConversationIdRef.current,
          isTyping: false,
        });
        setIsTyping(false);
      }

      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      socket.emit("user:leave", {
        userId,
        conversationId: currentConversationIdRef.current,
      });
    }

    // Join new conversation
    console.log(`🏠 Joining: ${conversationId}`);

    const handleJoinSuccess = (data: any) => {
      if (data.conversationId === conversationId) {
        console.log("✅ Joined successfully");
        currentConversationIdRef.current = conversationId;
      }
    };

    const handleJoinError = (error: any) => {
      console.error("❌ Join failed:", error);
    };

    socket.once("conversation:joined", handleJoinSuccess);
    socket.once("conversation:error", handleJoinError);

    socket.emit("user:join", { userId, conversationId });

    // Cleanup - leave on unmount or conversation change
    return () => {
      if (currentConversationIdRef.current === conversationId) {
        console.log(`👋 Cleanup: leaving ${conversationId}`);

        // Stop typing if currently typing
        if (isTyping) {
          socket.emit("user:stop-typing", {
            userId,
            conversationId,
            isTyping: false,
          });
        }

        // Clear typing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }

        socket.emit("user:leave", { userId, conversationId });
        currentConversationIdRef.current = undefined;
      }
    };
  }, [conversationId, userId, isConnected]);

  /**
   * FIX #4: Memoized sendMessage to prevent recreating on every render
   */
  const sendMessage = useCallback(
    (
      content: string,
      receiver: string,
      attachments?: any[],
      relatedBooking?: string
    ) => {
      const socket = socketRef.current;
      if (!socket?.connected || !conversationId) {
        console.error("❌ Cannot send: not connected");
        return;
      }

      const tempId = `temp_${Date.now()}_${Math.random()}`;

      const optimisticMessage: IMessage = {
        _id: tempId,
        conversationId: conversationId,
        sender: {
          _id: userId,
          name: "You",
        },
        receiver: receiver,
        content: content,
        messageType: "text",
        attachments: attachments,
        isRead: false,
        createdAt: new Date(),
      };

      // Add optimistically (after removing any pending duplicates)
      setMessages((prev) => {
        // Remove any existing messages with similar content and timestamp to prevent duplicates
        const filtered = prev.filter(
          (msg) =>
            !(
              msg.content === content &&
              msg.sender._id === userId &&
              Math.abs(
                new Date(msg.createdAt).getTime() - new Date().getTime()
              ) < 1000
            )
        );
        return [...filtered, optimisticMessage];
      });

      console.log(`📨 Sending message: ${tempId}`);

      socket.emit("message:send", {
        conversationId,
        sender: userId,
        receiver,
        content,
        attachments,
        relatedBooking,
        tempId, // Send tempId so server can confirm it
      });
    },
    [conversationId, userId]
  );

  /**
   * FIXED: Improved typing handler with longer timeout and proper state management
   */
  const handleTypingWithDebounce = useCallback(() => {
    const socket = socketRef.current;
    if (!socket?.connected || !conversationId) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing start event (only if not already typing)
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("user:typing", {
        userId,
        conversationId,
        isTyping: true,
      });
      console.log("🟡 Started typing in:", conversationId);
    }

    // Set timeout to stop typing (longer timeout for better UX)
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("user:stop-typing", {
        userId,
        conversationId,
        isTyping: false,
      });
      console.log("⚪ Stopped typing in:", conversationId);
    }, 2000); // Increased to 2 seconds for better UX
  }, [conversationId, userId]); // Removed isTyping dependency

  const isUserOnline = useCallback(
    (checkUserId: string): boolean => {
      return users.get(checkUserId) ?? false;
    },
    [users]
  );

  return {
    isConnected,
    messages,
    sendMessage,
    handleTypingWithDebounce,
    isTyping,
    isUserOnline,
    setMessages, // For loading initial messages from API
  };
};
