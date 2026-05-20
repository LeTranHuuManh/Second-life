import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/context";
import { Link, useSearch } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  useGetConversations,
  useGetMessages,
  useSendMessage,
  ConversationDTO,
  MessageDTO,
  getGetMessagesQueryKey,
} from "@workspace/api-client-react";
import { useChatWebSocket } from "../hooks/use-chat-websocket";

export default function Messages() {
  const { user } = useAuth();
  const [selectedConv, setSelectedConv] = useState<ConversationDTO | null>(
    null,
  );
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userId = user ? Number(user.id) : undefined;
  const searchString = useSearch();

  // Realtime hook
  const { incomingMessages } = useChatWebSocket(userId);

  // Queries
  const { data: conversationsData, refetch: refetchConversations } =
    useGetConversations({});

  // Combine real conversations with synthetic one if it exists
  const realConversations = conversationsData?.content || [];
  const conversations =
    selectedConv?.id === -1 &&
    !realConversations.find(
      (c) =>
        c.productId === selectedConv.productId &&
        c.partnerId === selectedConv.partnerId,
    )
      ? [selectedConv, ...realConversations]
      : realConversations;

  useEffect(() => {
    if (!conversationsData) return;
    if (selectedConv) return;

    const params = new URLSearchParams(searchString);
    const productId = params.get("productId");
    const recipientId = params.get("recipientId");
    const productTitle = params.get("productTitle");
    const partnerName = params.get("partnerName");

    if (productId && recipientId) {
      const existing = conversationsData.content?.find(
        (c) =>
          c.productId === Number(productId) &&
          c.partnerId === Number(recipientId),
      );

      if (existing) {
        setSelectedConv(existing);
      } else {
        setSelectedConv({
          id: -1,
          productId: Number(productId),
          partnerId: Number(recipientId),
          productTitle: productTitle || "Sản phẩm",
          partnerName: partnerName || "Người bán",
          unreadCount: 0,
        });
      }
    }
  }, [searchString, conversationsData, selectedConv]);

  const { data: messagesData } = useGetMessages(
    selectedConv?.id || 0,
    {},
    {
      query: {
        queryKey: getGetMessagesQueryKey(selectedConv?.id || 0, {}),
        enabled: !!selectedConv?.id,
      },
    },
  );

  const sendMessageMutation = useSendMessage();

  const [combinedMessages, setCombinedMessages] = useState<MessageDTO[]>([]);

  // Update combined messages
  useEffect(() => {
    if (messagesData?.content) {
      const sorted = [...messagesData.content].reverse();
      setCombinedMessages(sorted);
    }
  }, [messagesData]);

  // Append realtime messages
  useEffect(() => {
    if (incomingMessages.length > 0) {
      const latest = incomingMessages[incomingMessages.length - 1];
      if (latest.conversationId === selectedConv?.id) {
        setCombinedMessages((prev) => {
          if (prev.find((m) => m.id === latest.id)) return prev;
          return [...prev, latest];
        });
        setTimeout(
          () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          100,
        );
      }
      refetchConversations();
    }
  }, [incomingMessages, selectedConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [combinedMessages.length]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv) return;

    sendMessageMutation.mutate(
      {
        data: {
          conversationId:
            (selectedConv.id ?? 0) > 0 ? selectedConv.id : undefined,
          productId:
            (selectedConv.id ?? 0) < 0 ? selectedConv.productId : undefined,
          recipientId:
            (selectedConv.id ?? 0) < 0 ? selectedConv.partnerId : undefined,
          content: newMessage.trim(),
        },
      },
      {
        onSuccess: (savedMsg) => {
          setNewMessage("");
          if ((selectedConv.id ?? 0) < 0 && savedMsg.conversationId) {
            // Update selectedConv with real ID to prevent recreating new ones
            setSelectedConv((prev) =>
              prev ? { ...prev, id: savedMsg.conversationId! } : prev,
            );
          }
          setCombinedMessages((prev) => {
            if (prev.find((m) => m.id === savedMsg.id)) return prev;
            return [...prev, savedMsg];
          });
          refetchConversations();
          setTimeout(
            () =>
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
            100,
          );
        },
      },
    );
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Đăng nhập để xem tin nhắn</h2>
        <Link href="/dang-nhap">
          <Button className="rounded-full mt-4">Đăng nhập</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0 md:px-4 py-0 md:py-6 max-w-5xl">
      <div
        className="bg-white rounded-none md:rounded-3xl border-0 md:border border-border shadow-none md:shadow-sm overflow-hidden"
        style={{ height: "calc(100vh - 120px)" }}
      >
        <div className="flex h-full">
          {/* Sidebar */}
          <div
            className={`w-full md:w-80 border-r border-border flex flex-col flex-shrink-0 ${selectedConv ? "hidden md:flex" : "flex"}`}
          >
            <div className="p-4 border-b border-border">
              <h2 className="font-bold text-lg font-display mb-3">Tin nhắn</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <MessageCircle className="w-12 h-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground text-sm">
                    Chưa có tin nhắn nào
                  </p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-secondary/30 transition-colors border-b border-border/30 text-left ${selectedConv?.id === conv.id ? "bg-primary/5" : ""}`}
                  >
                    <div className="relative">
                      <Avatar className="h-11 w-11">
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {conv.partnerName?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {(conv.unreadCount ?? 0) > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                          {conv.unreadCount ?? 0}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-semibold text-sm truncate">
                          {conv.partnerName}
                        </span>
                      </div>
                      <p className="text-xs truncate text-muted-foreground mb-1">
                        Sản phẩm: {conv.productTitle}
                      </p>
                      <p
                        className={`text-xs truncate ${(conv.unreadCount ?? 0) > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}
                      >
                        {conv.lastMessage || "Chưa có tin nhắn"}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div
            className={`flex-1 flex flex-col ${!selectedConv ? "hidden md:flex" : "flex"}`}
          >
            {selectedConv ? (
              <>
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConv(null)}
                    className="md:hidden mr-1"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {selectedConv.partnerName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">
                      {selectedConv.partnerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedConv.productTitle}
                    </p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {combinedMessages.map((msg) => {
                    const isMe = msg.senderId === userId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        {!isMe && (
                          <Avatar className="h-7 w-7 mr-2 mt-1 flex-shrink-0">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              {selectedConv.partnerName?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            isMe
                              ? "bg-primary text-white rounded-br-sm"
                              : "bg-secondary/60 text-foreground rounded-bl-sm"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-[10px] mt-1 ${isMe ? "text-white/70" : "text-muted-foreground"}`}
                          >
                            {msg.createdAt &&
                              new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-border">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 h-10 px-4 rounded-full bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                    />
                    <Button
                      type="submit"
                      disabled={
                        sendMessageMutation.isPending || !newMessage.trim()
                      }
                      size="icon"
                      className="rounded-full h-10 w-10 shadow-colored"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <MessageCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="font-semibold text-muted-foreground mb-1">
                  Chọn cuộc trò chuyện
                </h3>
                <p className="text-sm text-muted-foreground/70">
                  Chọn một cuộc trò chuyện từ danh sách để bắt đầu nhắn tin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
