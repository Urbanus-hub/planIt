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
    {
      _id: "1",
      clientName: "Sarah Johnson",
      clientId: "client1",
      lastMessage:
        "Hi! I would like to book your photography services for my wedding.",
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      unreadCount: 2,
      status: "active",
      messageCount: 12,
      isOnline: true,
      priority: "high",
    },
    {
      _id: "2",
      clientName: "James Anderson",
      clientId: "client2",
      lastMessage:
        "Thanks for the quote! Can we discuss customization options?",
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      unreadCount: 1,
      status: "active",
      messageCount: 8,
      isOnline: true,
      priority: "medium",
    },
    {
      _id: "3",
      clientName: "Emily Davis",
      clientId: "client3",
      lastMessage: "Perfect! Looking forward to working with you on the event.",
      lastMessageTime: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      unreadCount: 0,
      status: "active",
      messageCount: 24,
      isOnline: false,
      priority: "low",
    },
    {
      _id: "4",
      clientName: "Michael Brown",
      clientId: "client4",
      lastMessage:
        "Thank you so much! We were very satisfied with the service.",
      lastMessageTime: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      unreadCount: 0,
      status: "closed",
      messageCount: 6,
      isOnline: false,
      priority: "low",
    },
  ];

  const mockConversations: { [key: string]: Conversation } = {
    "1": {
      _id: "1",
      messages: [
        {
          _id: "m1",
          senderId: "client1",
          senderName: "Sarah Johnson",
          content:
            "Hi! I would like to book your photography services for my wedding.",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          _id: "m2",
          senderId: "vendor",
          senderName: "You",
          content:
            "Hello Sarah! Thank you for reaching out. I'd be happy to help with your wedding photography. What's your event date?",
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          _id: "m3",
          senderId: "client1",
          senderName: "Sarah Johnson",
          content:
            "The wedding is on June 15th. We're expecting around 150 guests.",
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          read: true,
        },
        {
          _id: "m4",
          senderId: "client1",
          senderName: "Sarah Johnson",
          content: "Could you send me your pricing information?",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          read: false,
        },
      ],
    },
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
    <div key={message._id} className="w-full">
      <motion.div
        className="p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-500 transition-all cursor-pointer shadow-sm hover:shadow-md"
        onClick={() => setSelectedMessage(message)}
        whileHover={{ y: -2 }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-2">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {message.clientName?.[0]?.toUpperCase() || "U"}
                </div>
                {message.isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-gray-900 font-semibold text-sm">
                    {message.clientName}
                  </h4>
                  {message.priority === "high" && (
                    <Badge className="bg-red-100 text-red-800 text-xs border-red-200">
                      🔥 Urgent
                    </Badge>
                  )}
                  {message.unreadCount! > 0 && (
                    <Badge className="bg-indigo-100 text-indigo-800 text-xs border-indigo-200">
                      {message.unreadCount} new
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {message.messageCount} messages
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-700 line-clamp-2 mb-2">
              {message.lastMessage}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {new Date(message.lastMessageTime || "").toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </span>
              <div className="flex items-center gap-1">
                {message.status === "closed" && (
                  <Badge className="bg-gray-100 text-gray-800 text-xs">
                    Closed
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMessage(message);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-orange-600 hover:bg-orange-50"
              onClick={(e) => {
                e.stopPropagation();
                archiveConversation(message._id);
              }}
            >
              <Archive className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                deleteConversation(message._id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
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
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
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
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
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
            {
              label: "High Priority",
              value: stats.highPriorityCount,
              icon: Zap,
              color: "text-orange-600",
              bg: "from-orange-50 to-orange-100",
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
              <CardHeader className="border-b border-gray-200">
                <div>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-indigo-600" />
                    Conversations
                  </CardTitle>
                  <CardDescription className="text-gray-500 mt-1">
                    {filtered.length} conversation
                    {filtered.length !== 1 ? "s" : ""}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-1 overflow-y-auto">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100 border border-gray-200 p-1 mb-4">
                    {["active", "archived", "closed"].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-xs md:text-sm text-gray-600"
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
                        <div className="animate-spin h-8 w-8 border-4 border-gray-200 border-t-indigo-600 rounded-full mx-auto mb-2" />
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
                      <AnimatedList
                        items={animatedListItems}
                        className="w-full space-y-2"
                        itemClassName="w-full"
                        displayScrollbar={false}
                      />
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
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                          {selectedMessage.clientName?.[0]?.toUpperCase() ||
                            "U"}
                        </div>
                        {selectedMessage.isOnline && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedMessage.clientName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {selectedMessage.isOnline ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversations[selectedMessage._id]?.messages.map((msg) => (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        msg.senderId === "vendor"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          msg.senderId === "vendor"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.senderId === "vendor"
                              ? "text-indigo-100"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </CardContent>

                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1 bg-gray-50 border-gray-200 focus:border-indigo-500"
                    />
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-white border border-gray-200 shadow-sm h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    Select a conversation to start chatting
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
