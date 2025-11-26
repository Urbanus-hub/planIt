"use client";

import { useEffect, useRef, useState } from "react";
import { initSocket, getSocket, disconnectSocket } from "@/lib/socketConfig";
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
 * Custom hook for managing real-time messaging with Socket.IO
 * Handles message sending/receiving, typing indicators, and user presence
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
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users, setUsers] = useState<Map<string, boolean>>(new Map()); // userId -> isOnline

  /**
   * Initialize Socket.IO connection on mount
   */
  useEffect(() => {
    socketRef.current = initSocket();

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("Messaging socket connected");
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      console.log("Messaging socket disconnected");
    });

    return () => {
      // Don't disconnect on unmount - let other components use the socket
    };
  }, []);

  /**
   * Join conversation room when conversationId changes
   */
  useEffect(() => {
    if (!socketRef.current?.connected || !conversationId || !userId) return;

    socketRef.current.emit("user:join", {
      userId,
      conversationId,
    });

    console.log(`Joined conversation: ${conversationId}`);

    return () => {
      if (socketRef.current && conversationId && userId) {
        socketRef.current.emit("user:leave", {
          userId,
          conversationId,
        });
      }
    };
  }, [conversationId, userId, isConnected]);

  /**
   * Listen for incoming messages
   */
  useEffect(() => {
    if (!socketRef.current) return;

    const handleMessageReceive = (message: IMessage) => {
      setMessages((prev) => [...prev, message]);
      onMessageReceived?.(message);
    };

    const handleUserOnline = (data: { userId: string; timestamp: Date }) => {
      setUsers((prev) => new Map(prev).set(data.userId, true));
      onUserOnline?.(data);
    };

    const handleUserOffline = (data: { userId: string; timestamp: Date }) => {
      setUsers((prev) => new Map(prev).set(data.userId, false));
    };

    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      onTyping?.(data);
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

    socketRef.current.on("message:receive", handleMessageReceive);
    socketRef.current.on("user:online", handleUserOnline);
    socketRef.current.on("user:offline", handleUserOffline);
    socketRef.current.on("user:typing", handleTyping);
    socketRef.current.on("message:read", handleMessageRead);

    return () => {
      socketRef.current?.off("message:receive", handleMessageReceive);
      socketRef.current?.off("user:online", handleUserOnline);
      socketRef.current?.off("user:offline", handleUserOffline);
      socketRef.current?.off("user:typing", handleTyping);
      socketRef.current?.off("message:read", handleMessageRead);
    };
  }, [onMessageReceived, onTyping, onUserOnline, onMessageRead]);

  /**
   * Send a message to the receiver
   * Saves message to DB via backend
   */
  const sendMessage = (
    content: string,
    receiver: string,
    attachments?: any[],
    relatedBooking?: string
  ) => {
    if (!socketRef.current?.connected || !conversationId) {
      console.error("Socket not connected or no conversation selected");
      return;
    }

    socketRef.current.emit("message:send", {
      conversationId,
      sender: userId,
      receiver,
      content,
      attachments,
      relatedBooking,
    });
  };

  /**
   * Broadcast typing indicator to receiver
   * Called when user starts typing
   */
  const broadcastTyping = () => {
    if (!socketRef.current?.connected || !conversationId) return;

    socketRef.current.emit("user:typing", {
      userId,
      conversationId,
    });
  };

  /**
   * Stop typing indicator after user finishes
   * Called with debounce to reduce network traffic
   */
  const stopTyping = () => {
    if (!socketRef.current?.connected || !conversationId) return;

    socketRef.current.emit("user:stop-typing", {
      userId,
      conversationId,
    });
  };

  /**
   * Debounced typing handler
   * Shows "User is typing..." indicator with minimal network calls
   */
  const handleTypingWithDebounce = () => {
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing if not already typing
    if (!isTyping) {
      setIsTyping(true);
      broadcastTyping();
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping();
    }, 3000);
  };

  /**
   * Get online status for a specific user
   */
  const isUserOnline = (userId: string): boolean => {
    return users.get(userId) ?? false;
  };

  return {
    isConnected,
    messages,
    sendMessage,
    handleTypingWithDebounce,
    isTyping,
    isUserOnline,
    setMessages, // For loading initial messages
  };
};
