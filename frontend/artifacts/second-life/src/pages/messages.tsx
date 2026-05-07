import React, { useState } from "react";
import { MessageCircle, Send, ChevronLeft, Store, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/context";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockConversations = [
  {
    id: "1",
    shopName: "Shop Đồ Gỗ Thủ Công",
    shopAvatar: "https://i.pravatar.cc/40?img=1",
    lastMessage: "Sản phẩm còn hàng không shop ơi?",
    time: "10 phút trước",
    unread: 2,
    type: "buyer",
    messages: [
      { id: 1, text: "Xin chào! Tôi muốn hỏi về chiếc bàn gỗ sồi.", from: "me", time: "09:00" },
      { id: 2, text: "Chào bạn! Bàn này còn hàng nhé, chất lượng rất tốt.", from: "shop", time: "09:05" },
      { id: 3, text: "Giá có thể thương lượng không ạ?", from: "me", time: "09:10" },
      { id: 4, text: "Bạn có thể cho tôi biết thêm về tình trạng sản phẩm không?", from: "me", time: "09:15" },
      { id: 5, text: "Sản phẩm còn hàng không shop ơi?", from: "me", time: "09:20" },
    ],
  },
  {
    id: "2",
    shopName: "Fashion Hà Nội Store",
    shopAvatar: "https://i.pravatar.cc/40?img=5",
    lastMessage: "Cảm ơn bạn đã mua hàng!",
    time: "2 giờ trước",
    unread: 0,
    type: "buyer",
    messages: [
      { id: 1, text: "Shop có size M không?", from: "me", time: "08:00" },
      { id: 2, text: "Dạ có ạ, bạn muốn màu gì?", from: "shop", time: "08:02" },
      { id: 3, text: "Màu xanh ạ", from: "me", time: "08:05" },
      { id: 4, text: "Cảm ơn bạn đã mua hàng!", from: "shop", time: "08:10" },
    ],
  },
  {
    id: "3",
    shopName: "Nguyễn Văn An",
    shopAvatar: "https://i.pravatar.cc/40?img=12",
    lastMessage: "Cho hỏi sản phẩm còn không?",
    time: "Hôm qua",
    unread: 1,
    type: "seller",
    messages: [
      { id: 1, text: "Cho hỏi sản phẩm còn không?", from: "shop", time: "Hôm qua 14:00" },
    ],
  },
  {
    id: "4",
    shopName: "Trần Thị Bình",
    shopAvatar: "https://i.pravatar.cc/40?img=20",
    lastMessage: "Bao giờ lấy được ạ?",
    time: "2 ngày trước",
    unread: 0,
    type: "seller",
    messages: [
      { id: 1, text: "Bao giờ lấy được ạ?", from: "shop", time: "2 ngày trước" },
      { id: 2, text: "Ngày mai bạn nhé!", from: "me", time: "2 ngày trước" },
    ],
  },
];

export default function Messages() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"buyer" | "seller">("buyer");
  const [selectedConv, setSelectedConv] = useState<(typeof mockConversations)[0] | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const conversations = mockConversations.filter((c) => c.type === activeTab);

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
      <div className="bg-white rounded-none md:rounded-3xl border-0 md:border border-border shadow-none md:shadow-sm overflow-hidden" style={{ height: "calc(100vh - 120px)" }}>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className={`w-full md:w-80 border-r border-border flex flex-col flex-shrink-0 ${selectedConv ? "hidden md:flex" : "flex"}`}>
            <div className="p-4 border-b border-border">
              <h2 className="font-bold text-lg font-display mb-3">Tin nhắn</h2>
              <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl">
                <button
                  onClick={() => { setActiveTab("buyer"); setSelectedConv(null); }}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "buyer" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Mua hàng
                </button>
                <button
                  onClick={() => { setActiveTab("seller"); setSelectedConv(null); }}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "seller" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Bán hàng
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <MessageCircle className="w-12 h-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground text-sm">Chưa có tin nhắn nào</p>
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
                        <AvatarImage src={conv.shopAvatar} />
                        <AvatarFallback className="bg-primary/20 text-primary">{conv.shopName[0]}</AvatarFallback>
                      </Avatar>
                      {conv.unread > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-semibold text-sm truncate">{conv.shopName}</span>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{conv.time}</span>
                      </div>
                      <p className={`text-xs truncate ${conv.unread ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${!selectedConv ? "hidden md:flex" : "flex"}`}>
            {selectedConv ? (
              <>
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <button onClick={() => setSelectedConv(null)} className="md:hidden mr-1">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={selectedConv.shopAvatar} />
                    <AvatarFallback className="bg-primary/20 text-primary">{selectedConv.shopName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{selectedConv.shopName}</p>
                    <p className="text-xs text-muted-foreground">Đang hoạt động</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {selectedConv.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                      {msg.from === "shop" && (
                        <Avatar className="h-7 w-7 mr-2 mt-1 flex-shrink-0">
                          <AvatarImage src={selectedConv.shopAvatar} />
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">{selectedConv.shopName[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          msg.from === "me"
                            ? "bg-primary text-white rounded-br-sm"
                            : "bg-secondary/60 text-foreground rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${msg.from === "me" ? "text-white/70" : "text-muted-foreground"}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newMessage.trim()) return;
                      setNewMessage("");
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 h-10 px-4 rounded-full bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                    />
                    <Button type="submit" size="icon" className="rounded-full h-10 w-10 shadow-colored">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <MessageCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="font-semibold text-muted-foreground mb-1">Chọn cuộc trò chuyện</h3>
                <p className="text-sm text-muted-foreground/70">Chọn một cuộc trò chuyện từ danh sách để bắt đầu nhắn tin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
