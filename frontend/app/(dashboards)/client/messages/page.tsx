"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
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
import { useState } from "react";
import { toast } from "sonner";

export default function ClientMessages() {
  const [selectedConversation, setSelectedConversation] = useState("1");
  const [messageInput, setMessageInput] = useState("");

  const conversations = [
    {
      id: "1",
      vendor: "Elite Catering Co.",
      lastMessage: "Thanks for choosing us! Your catering is confirmed.",
      time: "2 hours ago",
      unread: 0,
      avatar:
        "https://images.unsplash.com/photo-1555939594-58d7cb561522?w=100&h=100&fit=crop",
      online: true,
    },
    {
      id: "2",
      vendor: "Pro Photographers",
      lastMessage: "Can you confirm the timing for the event?",
      time: "5 hours ago",
      unread: 2,
      avatar:
        "https://images.unsplash.com/photo-1606011334315-76b8191da5f3?w=100&h=100&fit=crop",
      online: true,
    },
    {
      id: "3",
      vendor: "Sound Masters Pro",
      lastMessage: "Equipment will be delivered one day before the event",
      time: "1 day ago",
      unread: 0,
      avatar:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop",
      online: false,
    },
  ];

  const messages = {
    "1": [
      {
        id: "1",
        sender: "vendor",
        text: "Hi! Thanks for booking with us.",
        time: "10:30 AM",
      },
      {
        id: "2",
        sender: "client",
        text: "Thank you! Looking forward to it.",
        time: "10:32 AM",
      },
      {
        id: "3",
        sender: "vendor",
        text: "Thanks for choosing us! Your catering is confirmed.",
        time: "10:35 AM",
      },
    ],
    "2": [
      {
        id: "1",
        sender: "vendor",
        text: "Hi! Let's discuss your event photography.",
        time: "2:00 PM",
      },
      {
        id: "2",
        sender: "client",
        text: "Sure! I need coverage for the whole day.",
        time: "2:15 PM",
      },
      {
        id: "3",
        sender: "vendor",
        text: "Can you confirm the timing for the event?",
        time: "2:30 PM",
      },
    ],
    "3": [
      {
        id: "1",
        sender: "vendor",
        text: "Good news! Your DJ equipment is all set.",
        time: "Yesterday",
      },
      {
        id: "2",
        sender: "client",
        text: "Great! When will you deliver?",
        time: "Yesterday",
      },
      {
        id: "3",
        sender: "vendor",
        text: "Equipment will be delivered one day before the event",
        time: "Yesterday",
      },
    ],
  };

  const currentConversation = conversations.find(
    (c) => c.id === selectedConversation
  );
  const currentMessages =
    messages[selectedConversation as keyof typeof messages] || [];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      toast.success("Message sent!");
      setMessageInput("");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="flex-1 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto h-[calc(100vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Conversations List */}
            <Card className="lg:col-span-1 bg-white dark:bg-gray-800 border-2 flex flex-col">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-lg font-bold">Messages</CardTitle>
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10 bg-gray-100 dark:bg-gray-700 border-0"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0">
                <div className="space-y-1 p-4">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        selectedConversation === conv.id
                          ? "bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-600"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conv.avatar} alt={conv.vendor} />
                          <AvatarFallback>
                            {conv.vendor.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                          {conv.vendor}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {conv.lastMessage}
                        </p>
                      </div>
                      {conv.unread > 0 && (
                        <span className="flex-shrink-0 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Area */}
            {currentConversation ? (
              <Card className="lg:col-span-2 bg-white dark:bg-gray-800 border-2 flex flex-col">
                {/* Chat Header */}
                <CardHeader className="pb-4 border-b flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={currentConversation.avatar}
                        alt={currentConversation.vendor}
                      />
                      <AvatarFallback>
                        {currentConversation.vendor.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-bold">
                        {currentConversation.vendor}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {currentConversation.online ? "Online now" : "Offline"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.sender === "client"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender === "client"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === "client"
                              ? "text-blue-100"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600"
                    >
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="bg-gray-100 dark:bg-gray-700 border-0"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="lg:col-span-2 bg-white dark:bg-gray-800 border-2 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Select a conversation to start messaging
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
