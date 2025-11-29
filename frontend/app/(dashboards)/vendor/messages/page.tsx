"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/hooks/useMessaging";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Search,
  RefreshCw,
  Send,
  Paperclip,
  Smile,
  Archive,
  AlertCircle,
  Clock,
  CheckCircle2,
  User,
  TrendingUp,
  Zap,
  Award,
  Eye,
  Trash2,
  MoreHorizontal,
  Reply,
  Pin,
  Bell,
  Loader2,
} from "lucide-react";
import AnimatedList from "@/components/ui/animated-list";
import ConfirmDialog from "@/components/ui/confirm-dialog";

import { conversationAPI } from "@/lib/api";
import { IMessage } from "@/hooks/useMessaging";

interface ConversationProps {
  id: string;
  client: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
  pinned: boolean;
  clientId: string;
  status?: "active" | "archived" | "closed";
  priority?: "high" | "medium" | "low";
}

type Message = ConversationProps;

type Conversation = {
  _id: string;
  messages: IMessage[];
};

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<{
    [key: string]: Conversation;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [newMessageText, setNewMessageText] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Socket.IO messaging hook for real-time updates
  const messagingResult = useMessaging({
    userId: user?._id || "",
    conversationId: selectedMessage?.id || undefined,
    onMessageReceived: (message) => {
      console.log("📨 New message received:", message);
      // Only show toast if it's not from current user
      if (message.sender._id !== user?._id) {
        toast.success("New message from " + message.sender.name);
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
      // Update online status for conversations
      setMessages((prev) =>
        prev.map((msg) =>
          msg.clientId === data.userId ? { ...msg, online: true } : msg
        )
      );
    },
  });

  const {
    isConnected,
    messages: socketMessages,
    sendMessage,
    handleTypingWithDebounce,
    isUserOnline,
    setMessages: setSocketMessages,
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
        if (setSocketMessages) {
          setSocketMessages(response.data.messages);
        }

        // Mark messages as read
        await conversationAPI.markMessagesAsRead(conversationId);
      } else {
        console.log("No messages found, starting fresh conversation");
        if (setSocketMessages) {
          setSocketMessages([]);
        }
      }
    } catch (error: any) {
      console.error("Error loading messages:", error);
      if (error.response?.status !== 404) {
        toast.error("Failed to load messages");
      }
      if (setSocketMessages) {
        setSocketMessages([]);
      }
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const loadConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUserId = user?._id;

      if (!currentUserId) {
        toast.error("User not authenticated");
        return;
      }

      console.log("🔄 Loading vendor conversations...");
      const response = await conversationAPI.getUserConversations(
        currentUserId
      );

      if (response.data?.success && response.data?.conversations) {
        const conversations = response.data.conversations.map((conv: any) => {
          // For vendors, the "other participant" is the client
          const client = conv.participants.find(
            (p: any) => p._id !== currentUserId
          );

          return {
            id: conv._id,
            client: client?.name || "Unknown Client",
            lastMessage: conv.lastMessage?.content || "No messages yet",
            time: conv.lastMessageAt
              ? new Date(conv.lastMessageAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Recently",
            unread: conv.unreadCount?.get?.(currentUserId) || 0,
            avatar: client?.avatar || "/placeholder-avatar.jpg",
            online: isUserOnline ? isUserOnline(client?._id || "") : false,
            pinned: false,
            clientId: client?._id || "",
            status: "active" as const,
            priority: "medium" as const,
          };
        });

        console.log(`✅ Loaded ${conversations.length} conversations`);
        setMessages(conversations);
      } else {
        console.log("No conversations found");
        setMessages([]);
      }
    } catch (err: any) {
      console.error("Error loading conversations:", err);
      setError(err?.message || "Failed to fetch conversations");
      toast.error("Failed to load conversations");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Load conversations on mount and when user changes
  useEffect(() => {
    if (user?._id) {
      loadConversations();
    }
  }, [user?._id]);

  // Real-time updates handled by Socket.IO - no need for polling

  // Load messages when conversation is selected - INSTANT
  useEffect(() => {
    if (selectedMessage?.id && isConnected) {
      loadConversationMessages(selectedMessage.id);
    }
  }, [selectedMessage?.id, isConnected]);

  // Update conversations with real-time online status
  const conversationsWithOnlineStatus = messages.map((conv) => ({
    ...conv,
    online: isUserOnline ? isUserOnline(conv.clientId) : false,
  }));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMessage, socketMessages]);

  const filtered = useMemo(() => {
    let list = conversationsWithOnlineStatus;

    if (activeTab === "active") {
      list = conversationsWithOnlineStatus.filter((m) => m.status === "active");
    } else if (activeTab === "archived") {
      list = conversationsWithOnlineStatus.filter(
        (m) => m.status === "archived"
      );
    } else if (activeTab === "closed") {
      list = conversationsWithOnlineStatus.filter((m) => m.status === "closed");
    }

    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (m) =>
        (m.client || "").toLowerCase().includes(q) ||
        (m.lastMessage || "").toLowerCase().includes(q)
    );
  }, [conversationsWithOnlineStatus, query, activeTab]);

  const stats = useMemo(() => {
    const conversationsWithStatus = conversationsWithOnlineStatus;
    const totalUnread = conversationsWithStatus.reduce(
      (sum, m) => sum + (m.unread || 0),
      0
    );
    const activeCount = conversationsWithStatus.filter(
      (m) => m.status === "active"
    ).length;
    const onlineCount = conversationsWithStatus.filter((m) => m.online).length;
    const highPriorityCount = conversationsWithStatus.filter(
      (m) => m.priority === "high"
    ).length;

    return { totalUnread, activeCount, onlineCount, highPriorityCount };
  }, [conversationsWithOnlineStatus]);

  /**
   * Handle sending a message via Socket.IO
   * Sends message to client through real-time connection
   */
  const handleSendMessage = async () => {
    console.log(`🎯 VENDOR SEND MESSAGE CALLED:`);
    console.log(`   - Message input: "${newMessageText}"`);
    console.log(`   - Selected conversation:`, selectedMessage);
    console.log(`   - Is connected: ${isConnected}`);
    console.log(`   - User ID: ${user?._id}`);
    console.log(`   - Is sending: ${isSending}`);

    // Prevent duplicate sends
    if (isSending) {
      console.log("⚠️ Already sending a message, ignoring duplicate call");
      return;
    }

    if (!newMessageText.trim()) {
      console.error("❌ Message input is empty");
      toast.error("Message cannot be empty");
      return;
    }

    if (!selectedMessage) {
      console.error("❌ No conversation selected");
      toast.error("Please select a conversation");
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

    if (!selectedMessage.clientId) {
      console.error("❌ No client ID found");
      toast.error("Invalid conversation - no client ID");
      return;
    }

    console.log(
      `✅ All validations passed, sending message to client: ${selectedMessage.clientId}`
    );

    try {
      // Set sending state to prevent duplicates
      setIsSending(true);

      // Send message through Socket.IO
      sendMessage(newMessageText, selectedMessage.clientId);

      // Clear input
      setNewMessageText("");
      console.log(`✅ Message sent and input cleared`);
      toast.success("Message sent!");
    } catch (error) {
      console.error("❌ Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      // Reset sending state after a short delay
      setTimeout(() => {
        setIsSending(false);
      }, 1000);
    }
  };

  const deleteConversation = (id: string) => {
    setPendingDeleteId(id);
    setDeleteOpen(true);
  };

  const performDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      setMessages((prev) => prev.filter((m) => m.id !== pendingDeleteId));
      if (selectedMessage?.id === pendingDeleteId) {
        setSelectedMessage(null);
      }
      toast.success("Conversation deleted");
    } catch (err: any) {
      toast.error("Failed to delete conversation");
    } finally {
      setDeleteOpen(false);
      setPendingDeleteId(null);
    }
  };

  const archiveConversation = (id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "archived" ? "active" : "archived" }
          : m
      )
    );
    toast.success("Conversation archived");
  };

  const animatedListItems = filtered.map((message) => (
    <motion.button
      key={message.id}
      onClick={() => {
        setSelectedMessage(message);
        // Clear typing indicators when switching conversations
        setTypingUsers(new Set());
        // Clear messages will be handled by useMessaging hook
      }}
      className={`w-full text-left p-3 rounded-xl transition-all duration-200 mb-2 border ${
        selectedMessage?.id === message.id
          ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
          : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-100 dark:border-gray-800"
      }`}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-semibold ${
              selectedMessage?.id === message.id
                ? "bg-green-600 dark:bg-green-700 text-white shadow-lg"
                : "bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 text-white shadow-md"
            }`}
          >
            {message.client?.[0]?.toUpperCase() || "U"}
          </div>
          {message.online && (
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-md" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
              {message.client}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 shrink-0">
              {message.time}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 truncate mt-1">
            {message.lastMessage}
          </p>
        </div>
        {message.unread > 0 && (
          <div className="shrink-0 ml-2">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-600 dark:bg-green-700 text-white text-xs font-bold shadow-lg">
              {message.unread}
            </span>
          </div>
        )}
      </div>
    </motion.button>
  ));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                Messages
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Connect with clients and manage conversations
              </p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="hidden md:block p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800"
            >
              <MessageCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
        >
          {[
            {
              label: "Unread Messages",
              value: stats.totalUnread,
              icon: Bell,
              color: "text-green-600 dark:text-green-500",
              bg: "bg-green-50 dark:bg-green-950/30",
              border: "border-green-200 dark:border-green-800",
            },
            {
              label: "Active Conversations",
              value: stats.activeCount,
              icon: MessageCircle,
              color: "text-green-600 dark:text-green-500",
              bg: "bg-green-50 dark:bg-green-950/30",
              border: "border-green-200 dark:border-green-800",
            },
            {
              label: "Online Clients",
              value: stats.onlineCount,
              icon: User,
              color: "text-green-600 dark:text-green-500",
              bg: "bg-green-50 dark:bg-green-950/30",
              border: "border-green-200 dark:border-green-800",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card
                  className={`bg-white dark:bg-gray-900 hover:shadow-md transition-all ${stat.border} border`}
                >
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                          {stat.label}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-2">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`${stat.bg} p-2 rounded-lg`}>
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    placeholder="Search conversations by client name or message..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 dark:focus:border-green-600"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={loadConversations}
                  className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden h-[600px] flex flex-col">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-500" />
                    Messages
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                    {filtered.length} conversation
                    {filtered.length !== 1 ? "s" : ""}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-3 flex-1 overflow-y-auto">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 mb-3">
                    {["active", "archived", "closed"].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="data-[state=active]:bg-green-600 dark:data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-sm text-xs text-gray-600 dark:text-gray-400"
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-0">
                    {loading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                      >
                        <div className="animate-spin h-8 w-8 border-4 border-gray-200 dark:border-gray-700 border-t-green-600 dark:border-t-green-500 rounded-full mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                          Loading...
                        </p>
                      </motion.div>
                    ) : error ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                      >
                        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {error}
                        </p>
                      </motion.div>
                    ) : filtered.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                      >
                        <MessageCircle className="h-8 w-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                          No conversations
                        </p>
                      </motion.div>
                    ) : (
                      <div className="space-y-2">{animatedListItems}</div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Conversation Detail */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="lg:col-span-2"
          >
            {selectedMessage ? (
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden h-[600px] flex flex-col">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <motion.button
                      onClick={() => setSelectedMessage(null)}
                      className="inline-flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 flex items-center justify-center text-sm font-bold text-white">
                          {selectedMessage.client?.[0]?.toUpperCase() || "U"}
                        </div>
                        {selectedMessage.online && (
                          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-md" />
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                          {selectedMessage.client}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedMessage.online ? "Active now" : "Away"}
                        </p>
                      </div>
                    </motion.button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMessage(null)}
                      className="h-9 w-9 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-950">
                  {isLoadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 text-green-600 dark:text-green-500 animate-spin mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Loading messages...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {!socketMessages || socketMessages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center max-w-md mx-auto p-6">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 flex items-center justify-center text-lg font-bold text-white mx-auto mb-4">
                              {selectedMessage?.client?.charAt(0) || "U"}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {selectedMessage?.client}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                              Start a conversation with this client. Send them a
                              message about their inquiry!
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              💬 Client ID: {selectedMessage?.clientId}
                            </p>
                          </div>
                        </div>
                      ) : (
                        (socketMessages || []).map(
                          (msg: IMessage, idx: number) => {
                            const isVendor = msg.sender._id === user?._id;
                            const prevMsg =
                              idx > 0 ? socketMessages[idx - 1] : null;
                            const sameAsPrev =
                              prevMsg?.sender._id === msg.sender._id;

                            return (
                              <motion.div
                                key={msg._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`flex ${
                                  isVendor ? "justify-end" : "justify-start"
                                } ${sameAsPrev ? "mt-1" : "mt-4"}`}
                              >
                                <div
                                  className={`flex gap-2 max-w-sm ${
                                    isVendor ? "flex-row-reverse" : "flex-row"
                                  }`}
                                >
                                  {!sameAsPrev && !isVendor && (
                                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300 shrink-0">
                                      {msg.sender.name?.[0]?.toUpperCase() ||
                                        selectedMessage?.client?.[0]?.toUpperCase()}
                                    </div>
                                  )}
                                  {!sameAsPrev && isVendor && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                      Y
                                    </div>
                                  )}
                                  {sameAsPrev && (
                                    <div className="w-8 shrink-0" />
                                  )}

                                  <div className="flex flex-col gap-1">
                                    <div
                                      className={`px-3 py-2 rounded-lg max-w-xs shadow-sm ${
                                        isVendor
                                          ? "bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 text-white rounded-br-none"
                                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-none"
                                      }`}
                                    >
                                      <p className="text-sm break-words">
                                        {msg.content}
                                      </p>
                                    </div>
                                    {!sameAsPrev && (
                                      <p
                                        className={`text-xs px-1 ${
                                          isVendor ? "text-right" : "text-left"
                                        } text-gray-500 dark:text-gray-400`}
                                      >
                                        {new Date(
                                          msg.createdAt
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          }
                        )
                      )}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
                  {/* Typing Indicator */}
                  {typingUsers.size > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 italic animate-pulse">
                      {selectedMessage?.client} is typing...
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    {/* Connection Status Indicator */}
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        isConnected ? "bg-green-500" : "bg-red-500"
                      }`}
                      title={isConnected ? "Connected" : "Disconnected"}
                    />

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-10 w-10 p-0 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-full"
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder={
                        isConnected ? "Type your message..." : "Connecting..."
                      }
                      value={newMessageText}
                      onChange={(e) => {
                        setNewMessageText(e.target.value);
                        if (e.target.value.trim() && handleTypingWithDebounce) {
                          handleTypingWithDebounce();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSendMessage();
                        }
                      }}
                      disabled={!isConnected || isSending}
                      className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-green-500 dark:focus:border-green-600 focus:bg-white dark:focus:bg-gray-700 rounded-full px-4 py-2 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    />
                    <motion.div
                      whileHover={{ scale: isConnected ? 1.1 : 1 }}
                      whileTap={{ scale: isConnected ? 0.95 : 1 }}
                    >
                      <Button
                        size="sm"
                        onClick={handleSendMessage}
                        disabled={
                          !newMessageText.trim() || !isConnected || isSending
                        }
                        className="h-10 w-10 p-0 bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 hover:from-green-600 hover:to-green-800 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isConnected ? (
                          <Send className="h-4 w-4" />
                        ) : (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-4"
                  >
                    <MessageCircle className="h-16 w-16 text-green-200 dark:text-green-900 mx-auto" />
                  </motion.div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    Select a conversation to start messaging
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Click on any conversation to see the chat
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setPendingDeleteId(null);
        }}
        title="Delete Conversation"
        description="Are you sure you want to delete this conversation? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={performDelete}
      />
    </div>
  );
}
