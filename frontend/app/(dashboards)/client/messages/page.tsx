"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/hooks/useMessaging";
import { conversationAPI } from "@/lib/api";
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

// Interface for conversation data
interface ConversationProps {
  id: string;
  vendor: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
  pinned: boolean;
  vendorId: string;
  category?: string;
  email?: string;
  isNew?: boolean;
}

export default function ClientMessages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [conversations, setConversations] = useState<ConversationProps[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Socket.IO messaging hook for real-time updates
  const messagingResult = useMessaging({
    userId: user?._id || "",
    conversationId: selectedConversation || undefined,
    onMessageReceived: (message) => {
      console.log("📨 New message received in client:", message);
      if (message.sender._id !== user?._id) {
        toast.success(`New message from ${message.sender.name}`);
      }
      // Message already handled by useMessaging hook - no need to reload conversations
    },
    onTyping: (data) => {
      // Only show typing for other users, not current user
      if (data.userId !== user?._id) {
        if (data.isTyping) {
          setTypingUsers((prev) => new Set(prev).add(data.userId));
          console.log("🟡 User started typing:", data.userId);
        } else {
          setTypingUsers((prev) => {
            const next = new Set(prev);
            next.delete(data.userId);
            console.log("⚪ User stopped typing:", data.userId);
            return next;
          });
        }
      }
    },
    onUserOnline: (data) => {
      console.log("🟢 User online:", data);
    },
  });

  const {
    isConnected,
    messages: socketMessages,
    sendMessage,
    handleTypingWithDebounce,
    isTyping,
    isUserOnline,
    setMessages,
  } = messagingResult || {};

  // Load messages for the selected conversation
  const loadConversationMessages = async (conversationId: string) => {
    if (!conversationId || !user?._id) return;

    setIsLoadingMessages(true);
    try {
      console.log(`📚 Loading messages for conversation: ${conversationId}`);
      const response = await conversationAPI.getConversationMessages(
        conversationId
      );

      if (response.data?.success && response.data?.messages) {
        console.log(`✅ Loaded ${response.data.messages.length} messages`);
        if (setMessages) {
          setMessages(response.data.messages);
        }

        // Mark messages as read
        await conversationAPI.markMessagesAsRead(conversationId);
      } else {
        console.log("No messages found, starting fresh conversation");
        if (setMessages) {
          setMessages([]);
        }
      }
    } catch (error: any) {
      console.error("Error loading messages:", error);
      // Don't show error toast for 404 (no messages yet)
      if (error.response?.status !== 404) {
        toast.error("Failed to load messages");
      }
      if (setMessages) {
        setMessages([]);
      }
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation && isConnected) {
      loadConversationMessages(selectedConversation);
    }
  }, [selectedConversation, isConnected]);

  // Load conversations function - moved outside useEffect for accessibility
  const loadConversations = async () => {
    try {
      // Get current user ID from auth context
      const currentUserId = user?._id;

      if (!currentUserId) {
        toast.error("User not authenticated");
        return;
      }

      // Fetch conversations from API
      let initialConversations: ConversationProps[] = [];
      try {
        const response = await conversationAPI.getUserConversations(
          currentUserId
        );
        if (response.data?.success && response.data?.conversations) {
          initialConversations = response.data.conversations.map(
            (conv: any) => ({
              id: conv._id,
              vendor:
                conv.participants.find((p: any) => p._id !== currentUserId)
                  ?.name || "Unknown Vendor",
              lastMessage: conv.lastMessage?.content || "No messages yet",
              time: conv.lastMessageAt
                ? new Date(conv.lastMessageAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Recently",
              unread: conv.unreadCount?.get?.(currentUserId) || 0,
              avatar:
                conv.participants.find((p: any) => p._id !== currentUserId)
                  ?.avatar || "/placeholder-avatar.jpg",
              online: false, // Will be updated by online status check
              pinned: false,
              vendorId:
                conv.participants.find((p: any) => p._id !== currentUserId)
                  ?._id || "",
              category:
                conv.participants.find((p: any) => p._id !== currentUserId)
                  ?.businessType || undefined,
              email:
                conv.participants.find((p: any) => p._id !== currentUserId)
                  ?.email || undefined,
            })
          );
        }
      } catch (error) {
        console.log("No existing conversations found, starting fresh");
      }

      // Check if a new vendor conversation was initiated
      const newConversationVendor = sessionStorage.getItem(
        "newConversationVendor"
      );
      let selectedConvId: string | null = null;

      if (newConversationVendor) {
        try {
          const vendorData = JSON.parse(newConversationVendor);

          // Check if conversation already exists
          let existingConversation = initialConversations.find(
            (conv) => conv.vendorId === vendorData.id
          );

          if (existingConversation) {
            // Use existing conversation - don't create a new one
            selectedConvId = existingConversation.id;
            console.log(
              `✅ Found existing conversation with ${vendorData.name}:`,
              existingConversation.id
            );
            toast.info(`Continuing conversation with ${vendorData.name}`);
          } else {
            // Create new conversation since none exists
            console.log(
              `🆕 Creating new conversation with vendor: ${vendorData.name}`
            );

            try {
              const response = await conversationAPI.getOrCreateConversation(
                vendorData.id
              );

              if (response.data?.success && response.data?.conversation) {
                const newConv = response.data.conversation;
                selectedConvId = newConv._id;

                // Add the new conversation to our list
                const newConversation: ConversationProps = {
                  id: newConv._id,
                  vendor: vendorData.name,
                  lastMessage: "Start your conversation here",
                  time: "Now",
                  unread: 0,
                  avatar: vendorData.avatar || "/placeholder-avatar.jpg",
                  online: false,
                  pinned: false,
                  vendorId: vendorData.id,
                  category: vendorData.businessType,
                  email: vendorData.email,
                };

                initialConversations = [
                  newConversation,
                  ...initialConversations,
                ];
                console.log(
                  `✅ Created new conversation: ${selectedConvId}`,
                  newConversation
                );
                toast.success(`Started conversation with ${vendorData.name}`);
              } else {
                throw new Error("Failed to create conversation");
              }
            } catch (error) {
              console.error("Error creating new conversation:", error);
              toast.error(
                `Failed to start conversation with ${vendorData.name}`
              );
            }
          }

          // Clear the session storage
          sessionStorage.removeItem("newConversationVendor");
        } catch (error) {
          console.error("Error parsing vendor data from session:", error);
          sessionStorage.removeItem("newConversationVendor");
        }
      }

      // Update conversations with online status
      const conversationsWithOnlineStatus = initialConversations.map(
        (conv) => ({
          ...conv,
          online: isUserOnline(conv.vendorId),
        })
      );

      setConversations(conversationsWithOnlineStatus);

      // Auto-select conversation if specified
      if (selectedConvId) {
        const convToSelect = conversationsWithOnlineStatus.find(
          (conv) => conv.id === selectedConvId
        );
        if (convToSelect) {
          setSelectedConversation(convToSelect.id);
          console.log(`🎯 Auto-selected conversation: ${selectedConvId}`);
        }
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast.error("Failed to load conversations");
    }
  };

  // Real-time updates handled by Socket.IO - no need for polling  // Initialize conversations on mount
  useEffect(() => {
    if (user?._id) {
      loadConversations();
    }
  }, [user?._id]);

  // Update conversations with real-time online status in render (avoid useEffect loops)
  const conversationsWithOnlineStatus = conversations.map((conv) => ({
    ...conv,
    online: isUserOnline ? isUserOnline(conv.vendorId) : false,
  }));

  const currentConversation = selectedConversation
    ? conversationsWithOnlineStatus.find((c) => c.id === selectedConversation)
    : null;

  /**
   * Handle sending a message
   * - Validate message content
   * - Send via Socket.IO to backend
   * - Clear input field
   */
  const handleSendMessage = () => {
    console.log(`🎯 HANDLE SEND MESSAGE CALLED:`);
    console.log(`   - Message input: "${messageInput}"`);
    console.log(`   - Current conversation:`, currentConversation);
    console.log(`   - Is connected: ${isConnected}`);
    console.log(`   - User ID: ${user?._id}`);

    if (!messageInput.trim()) {
      console.error("❌ Message input is empty");
      toast.error("Message cannot be empty");
      return;
    }

    if (!currentConversation) {
      console.error("❌ No conversation selected");
      toast.error("No conversation selected");
      return;
    }

    if (!isConnected) {
      console.error("❌ Not connected to server");
      toast.error("Not connected to server. Please wait...");
      return;
    }

    if (!sendMessage) {
      console.error("❌ Send message function not available");
      toast.error("Messaging not ready. Please wait...");
      return;
    }

    console.log(`✅ All validations passed, sending message...`);

    // Send message through Socket.IO
    sendMessage(messageInput, currentConversation.vendorId);

    // Clear input
    setMessageInput("");
    console.log(`✅ Message sent and input cleared`);
    toast.success("Message sent!");
  };

  const handlePinConversation = () => {
    toast.success("Conversation pinned");
  };

  const handleSelectConversation = (id: string | null) => {
    // Prevent rapid switching to the same conversation
    if (id === selectedConversation) {
      setShowChatOnMobile(true);
      return;
    }

    console.log(`🔄 Switching to conversation: ${id}`);

    // Clear current state
    if (setMessages) {
      setMessages([]);
    }
    // Clear typing indicators for new conversation
    setTypingUsers(new Set());

    // Set new conversation
    setSelectedConversation(id);
    setShowChatOnMobile(true);
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
    if (e.target.value.trim() && handleTypingWithDebounce) {
      handleTypingWithDebounce();
    }
  };

  // Filter conversations based on search query
  const filteredConversations = conversationsWithOnlineStatus.filter((conv) =>
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
      <div className="flex-1 min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
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
                    <div className="relative shrink-0">
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
                      <span className="shrink-0 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div
            className={cn(
              "flex flex-col bg-white dark:bg-gray-800",
              showChatOnMobile ? "flex" : "hidden md:flex",
              "flex-1"
            )}
          >
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
                      <div className="flex items-center gap-2">
                        {currentConversation.category && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                          >
                            {currentConversation.category}
                          </Badge>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {currentConversation.online
                            ? "Active now"
                            : "Offline"}
                        </p>
                      </div>
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
                  {isLoadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Loading messages...
                        </p>
                      </div>
                    </div>
                  ) : !socketMessages || socketMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center max-w-md mx-auto p-6">
                        <Avatar className="h-16 w-16 mx-auto mb-4">
                          <AvatarImage
                            src={currentConversation?.avatar}
                            alt={currentConversation?.vendor}
                          />
                          <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 text-lg">
                            {currentConversation?.vendor?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {currentConversation?.vendor}
                        </h3>
                        {currentConversation?.category && (
                          <Badge
                            variant="secondary"
                            className="mb-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                          >
                            {currentConversation.category}
                          </Badge>
                        )}
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                          {currentConversation?.isNew
                            ? `Start a conversation with ${currentConversation.vendor}. Send them a message to discuss your event needs!`
                            : "No messages yet. Start the conversation!"}
                        </p>
                        {currentConversation?.email && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            📧 {currentConversation.email}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    (socketMessages || []).map((msg: any) => (
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
                            {msg.sender._id === user?._id &&
                              (msg.isRead ? (
                                <CheckCheck className="w-3 h-3 text-emerald-100" />
                              ) : (
                                <Check className="w-3 h-3 text-emerald-100" />
                              ))}
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
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full transition-colors ${
                          isConnected ? "bg-emerald-500" : "bg-red-500"
                        }`}
                        title={isConnected ? "Connected" : "Disconnected"}
                      />
                      {!isConnected && (
                        <span className="text-xs text-red-500">
                          Connecting...
                        </span>
                      )}
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
                          !isConnected
                            ? "Connecting to server..."
                            : isLoadingMessages
                            ? "Loading messages..."
                            : currentConversation?.isNew
                            ? `Message ${currentConversation.vendor}...`
                            : "Type a message..."
                        }
                        value={messageInput}
                        onChange={handleInputChange}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          handleSendMessage()
                        }
                        disabled={!isConnected || isLoadingMessages}
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
                      disabled={
                        !isConnected ||
                        !messageInput.trim() ||
                        isLoadingMessages
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      size="icon"
                    >
                      {isConnected && !isLoadingMessages ? (
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
