"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/hooks/useMessaging";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Check,
  CheckCheck,
  Pin,
  Plus,
  Smile,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ClientMessages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState("1");
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Socket.IO messaging hook for real-time updates
  const {
    isConnected,
    messages: socketMessages,
    sendMessage,
    handleTypingWithDebounce,
    isTyping,
    isUserOnline,
    setMessages,
  } = useMessaging({
    userId: user?._id || "",
    conversationId: selectedConversation,
    // Callback when message is received
    onMessageReceived: (message) => {
      console.log("📨 New message received:", message);
      toast.success("New message from " + message.sender.name);
    },
    // Callback when user is typing
    onTyping: (data) => {
      if (data.isTyping) {
        setTypingUsers((prev) => new Set(prev).add(data.userId));
      } else {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(data.userId);
          return next;
        });
      }
    },
    // Callback when user comes online
    onUserOnline: (data) => {
      toast.success("User is online");
    },
  });

  // Sample conversations - in production, fetch from API
  const conversations = [
    {
      id: "1",
      vendor: "Elite Catering Co.",
      lastMessage: "Thanks for choosing us! Your catering is confirmed.",
      time: "2 hours ago",
      unread: 0,
      avatar:
        "https://images.unsplash.com/photo-1555939594-58d7cb561522?w=100&h=100&fit=crop",
      online: isUserOnline("vendor1"),
      pinned: true,
      vendorId: "vendor1",
    },
    {
      id: "2",
      vendor: "Pro Photographers",
      lastMessage: "Can you confirm the timing for the event?",
      time: "5 hours ago",
      unread: 2,
      avatar:
        "https://images.unsplash.com/photo-1606011334315-76b8191da5f3?w=100&h=100&fit=crop",
      online: isUserOnline("vendor2"),
      pinned: false,
      vendorId: "vendor2",
    },
    {
      id: "3",
      vendor: "Sound Masters Pro",
      lastMessage: "Equipment will be delivered one day before the event",
      time: "1 day ago",
      unread: 0,
      avatar:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop",
      online: isUserOnline("vendor3"),
      pinned: false,
      vendorId: "vendor3",
    },
  ];

  const currentConversation = conversations.find(
    (c) => c.id === selectedConversation
  );

  /**
   * Handle sending a message
   * - Validate message content
   * - Send via Socket.IO to backend
   * - Clear input field
   */
  const handleSendMessage = () => {
    if (!messageInput.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    if (!currentConversation) {
      toast.error("No conversation selected");
      return;
    }

    if (!isConnected) {
      toast.error("Not connected to server. Please wait...");
      return;
    }

    // Send message through Socket.IO
    sendMessage(messageInput, currentConversation.vendorId);

    // Clear input
    setMessageInput("");
    toast.success("Message sent!");
  };

  const handlePinConversation = () => {
    toast.success("Conversation pinned");
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    setShowChatOnMobile(true);
    setTypingUsers(new Set()); // Clear typing indicators when switching conversations
  };

  const handleBackToList = () => {
    setShowChatOnMobile(false);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [socketMessages]);

  // Handle typing with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    if (e.target.value.trim()) {
      handleTypingWithDebounce();
    }
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conv) =>
    conv.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort conversations: pinned first, then by time
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex h-screen overflow-hidden">
          {/* Left Sidebar - Conversations List */}
          <div
            className={cn(
              "flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
              showChatOnMobile ? "hidden md:flex" : "flex",
              "w-full md:w-80"
            )}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Messages
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-emerald-600 dark:text-emerald-400"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10 bg-gray-100 dark:bg-gray-700 border-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                {sortedConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-all",
                      selectedConversation === conv.id
                        ? "bg-emerald-50 dark:bg-emerald-900/20"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conv.avatar} alt={conv.vendor} />
                        <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200">
                          {conv.vendor.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {conv.pinned && (
                            <Pin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          )}
                          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {conv.vendor}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {conv.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="flex-shrink-0 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className={cn(
            "flex flex-col bg-white dark:bg-gray-800",
            showChatOnMobile ? "flex" : "hidden md:flex",
            "flex-1"
          )}>
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={handleBackToList}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={currentConversation.avatar}
                        alt={currentConversation.vendor}
                      />
                      <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200">
                        {currentConversation.vendor.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        {currentConversation.vendor}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {currentConversation.online ? "Active now" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={handlePinConversation}
                    >
                      <Pin className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {socketMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">
                          No messages yet. Start the conversation!
                        </p>
                      </div>
                    </div>
                  ) : (
                    socketMessages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex gap-3 ${
                          msg.sender._id === user?._id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {msg.sender._id !== user?._id && (
                          <Avatar className="h-8 w-8 mt-1 shrink-0">
                            <AvatarImage
                              src={msg.sender.avatar}
                              alt={msg.sender.name}
                            />
                            <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 text-xs">
                              {msg.sender.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender._id === user?._id
                              ? "bg-emerald-600 text-white rounded-br-none"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <p
                              className={`text-xs ${
                                msg.sender._id === user?._id
                                  ? "text-emerald-100"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            {msg.sender._id === user?._id && (
                              msg.isRead ? (
                                <CheckCheck className="w-3 h-3 text-emerald-100" />
                              ) : (
                                <Check className="w-3 h-3 text-emerald-100" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Typing Indicator */}
                  {typingUsers.size > 0 && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 mt-1 shrink-0">
                        <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 text-xs">
                          {currentConversation?.vendor.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg rounded-bl-none">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2 items-center">
                    {/* Socket Status Indicator */}
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isConnected ? "bg-emerald-500" : "bg-red-500"
                        }`}
                        title={isConnected ? "Connected" : "Disconnected"}
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder={
                          isConnected
                            ? "Type a message..."
                            : "Connecting to server..."
                        }
                        value={messageInput}
                        onChange={handleInputChange}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        disabled={!isConnected}
                        className="bg-gray-100 dark:bg-gray-700 border-0 pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!isConnected || !messageInput.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      size="icon"
                    >
                      {isConnected ? (
                        <Send className="w-4 h-4" />
                      ) : (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
                <div className="text-center p-8">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}