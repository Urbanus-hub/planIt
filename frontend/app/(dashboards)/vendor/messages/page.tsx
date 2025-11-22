"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
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
} from "lucide-react";
import AnimatedList from "@/components/ui/animated-list";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useAuth } from "@/contexts/AuthContext";

type Message = {
  _id: string;
  clientName?: string;
  clientId?: string;
  clientAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  status?: "active" | "archived" | "closed";
  messageCount?: number;
  isOnline?: boolean;
  priority?: "high" | "medium" | "low";
};

type Conversation = {
  _id: string;
  messages: Array<{
    _id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    read: boolean;
  }>;
};

export default function MessagesPage() {
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

  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const mockMessages: Message[] = [
    
  ];

  const mockConversations: { [key: string]: Conversation } = {
    
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      setMessages(mockMessages);
      setConversations(mockConversations);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch messages");
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMessage, conversations]);

  const filtered = useMemo(() => {
    let list = messages;

    if (activeTab === "active") {
      list = messages.filter((m) => m.status === "active");
    } else if (activeTab === "archived") {
      list = messages.filter((m) => m.status === "archived");
    } else if (activeTab === "closed") {
      list = messages.filter((m) => m.status === "closed");
    }

    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (m) =>
        (m.clientName || "").toLowerCase().includes(q) ||
        (m.lastMessage || "").toLowerCase().includes(q)
    );
  }, [messages, query, activeTab]);

  const stats = useMemo(() => {
    const totalUnread = messages.reduce(
      (sum, m) => sum + (m.unreadCount || 0),
      0
    );
    const activeCount = messages.filter((m) => m.status === "active").length;
    const onlineCount = messages.filter((m) => m.isOnline).length;
    const highPriorityCount = messages.filter(
      (m) => m.priority === "high"
    ).length;

    return { totalUnread, activeCount, onlineCount, highPriorityCount };
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessageText.trim() || !selectedMessage) return;

    const conversation = conversations[selectedMessage._id];
    if (!conversation) return;

    const newMsg = {
      _id: `m${Date.now()}`,
      senderId: "vendor",
      senderName: "You",
      content: newMessageText,
      timestamp: new Date().toISOString(),
      read: true,
    };

    setConversations((prev) => ({
      ...prev,
      [selectedMessage._id]: {
        ...conversation,
        messages: [...conversation.messages, newMsg],
      },
    }));

    setMessages((prev) =>
      prev.map((m) =>
        m._id === selectedMessage._id
          ? {
              ...m,
              lastMessage: newMessageText,
              lastMessageTime: new Date().toISOString(),
            }
          : m
      )
    );

    setNewMessageText("");
    toast.success("Message sent!");
  };

  const deleteConversation = (id: string) => {
    setPendingDeleteId(id);
    setDeleteOpen(true);
  };

  const performDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      setMessages((prev) => prev.filter((m) => m._id !== pendingDeleteId));
      if (selectedMessage?._id === pendingDeleteId) {
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
        m._id === id
          ? { ...m, status: m.status === "archived" ? "active" : "archived" }
          : m
      )
    );
    toast.success("Conversation archived");
  };

  const animatedListItems = filtered.map((message) => (
    <motion.button
      key={message._id}
      onClick={() => setSelectedMessage(message)}
      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 mb-1.5 border ${
        selectedMessage?._id === message._id
          ? "bg-green-50 border-green-200"
          : "hover:bg-gray-50 border-transparent"
      }`}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-semibold ${
              selectedMessage?._id === message._id
                ? "bg-emerald-600 text-white"
                : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
            }`}
          >
            {message.clientName?.[0]?.toUpperCase() || "U"}
          </div>
          {message.isOnline && (
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white shadow-md" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-gray-900 truncate">
              {message.clientName}
            </h4>
            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
              {new Date(message.lastMessageTime || "").toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p className="text-xs text-gray-600 truncate">
            {message.lastMessage}
          </p>
        </div>
        {message.unreadCount! > 0 && (
          <div className="flex-shrink-0 ml-2">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500 text-white text-xs font-bold">
              {message.unreadCount}
            </span>
          </div>
        )}
      </div>
    </motion.button>
  ));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold   mb-2">
                Messages & Conversations
              </h1>
              <p className="text-gray-600 text-lg">
                Connect with clients and manage inquiries effortlessly
              </p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="hidden md:block p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200"
            >
              <MessageCircle className="h-8 w-8 text-indigo-600" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8"
        >
          {[
            {
              label: "Unread Messages",
              value: stats.totalUnread,
              icon: Bell,
              color: "text-red-600",
              bg: "from-red-50 to-red-100",
            },
            {
              label: "Active Conversations",
              value: stats.activeCount,
              icon: MessageCircle,
              color: "text-indigo-600",
              bg: "from-indigo-50 to-indigo-100",
            },
            {
              label: "Online Clients",
              value: stats.onlineCount,
              icon: User,
              color: "text-green-600",
              bg: "from-green-50 to-green-100",
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
                <Card className="bg-white hover:shadow-md transition-all border border-gray-200">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-500 text-xs font-medium">
                          {stat.label}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`bg-gradient-to-br ${stat.bg} p-2 rounded-lg`}
                      >
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
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations by client name or message..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-indigo-500"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={fetchMessages}
                  className="border-gray-300 hover:bg-gray-50"
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
            <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden h-[600px] flex flex-col">
              <CardHeader className="border-b border-gray-100 bg-white">
                <div>
                  <CardTitle className="text-gray-900 flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5 text-emerald-600" />
                    Messages
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
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
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100 border border-gray-200 p-1 mb-3">
                    {["active", "archived", "closed"].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-xs text-gray-600"
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
                        <div className="animate-spin h-8 w-8 border-4 border-gray-200 border-t-slate-500 rounded-full mx-auto mb-2" />
                        <p className="text-gray-500 text-sm font-medium">
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
                        <p className="text-gray-500 text-sm">{error}</p>
                      </motion.div>
                    ) : filtered.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                      >
                        <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm font-medium">
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
              <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden h-[600px] flex flex-col">
                <CardHeader className="border-b border-gray-100 bg-white">
                  <div className="flex items-center justify-between">
                    <motion.button
                      onClick={() => setSelectedMessage(null)}
                      className="inline-flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-emerald-200 flex items-center justify-center text-sm font-bold text-emerald-800">
                          {selectedMessage.clientName?.[0]?.toUpperCase() ||
                            "U"}
                        </div>
                        {selectedMessage.isOnline && (
                          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-md" />
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 text-base">
                          {selectedMessage.clientName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {selectedMessage.isOnline ? "Active now" : "Away"}
                        </p>
                      </div>
                    </motion.button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMessage(null)}
                      className="h-9 w-9 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                  <div className="flex flex-col gap-4">
                    {conversations[selectedMessage._id]?.messages.map(
                      (msg, idx) => {
                        const isVendor = msg.senderId === "vendor";
                        const prevMsg =
                          idx > 0
                            ? conversations[selectedMessage._id]?.messages[
                                idx - 1
                              ]
                            : null;
                        const sameAsPrev = prevMsg?.senderId === msg.senderId;

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
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-700 flex-shrink-0">
                                  {selectedMessage.clientName?.[0]?.toUpperCase()}
                                </div>
                              )}
                              {!sameAsPrev && isVendor && (
                                <div className="w-8 h-8 rounded-full bg-emerald-300 flex items-center justify-center text-xs font-bold text-emerald-900 flex-shrink-0">
                                  Y
                                </div>
                              )}
                              {sameAsPrev && (
                                <div className="w-8 flex-shrink-0" />
                              )}

                              <div className="flex flex-col gap-1">
                                <div
                                  className={`px-3 py-2 rounded-lg max-w-xs word-break ${
                                    isVendor
                                      ? "bg-emerald-100 text-emerald-900 rounded-br-none"
                                      : "bg-gray-100 text-gray-900 rounded-bl-none"
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
                                    } text-gray-500`}
                                  >
                                    {new Date(msg.timestamp).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      }
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </CardContent>

                <div className="border-t border-gray-200 p-4 bg-white">
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-10 w-10 p-0 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full"
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Aa"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-400 focus:bg-white rounded-2xl px-4 py-2 focus:ring-0"
                    />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="sm"
                        onClick={handleSendMessage}
                        disabled={!newMessageText.trim()}
                        className="h-10 w-10 p-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-white border border-gray-200 shadow-sm h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-4"
                  >
                    <MessageCircle className="h-16 w-16 text-green-200 mx-auto" />
                  </motion.div>
                  <p className="text-gray-500 font-medium">
                    Select a conversation to start messaging
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
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
