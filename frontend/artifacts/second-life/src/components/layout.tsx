import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth, useCart } from "@/lib/context";
import {
  Search,
  ShoppingCart,
  MapPin,
  Bell,
  MessageCircle,
  Menu,
  Leaf,
  Package,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-xl transition-all shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary font-display font-bold text-2xl hover:opacity-80 transition-opacity"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/logo.svg`}
              alt="Modo"
              className="w-9 h-9 object-contain rounded-xl"
            />
            <span className="hidden sm:inline-block">Modo</span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-xl mx-auto hidden md:flex relative group"
          >
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Tìm đồ nội thất, máy ảnh, quần áo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-full bg-secondary/50 border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
          </form>

          <div className="flex items-center gap-1 sm:gap-3">
            <Link href="/tim-kiem" className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary"
              >
                <Search className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/tin-nhan">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                {user && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full border-2 border-white"></span>
                )}
              </Button>
            </Link>

            <Link href="/gio-hang">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ml-1 ring-2 ring-transparent hover:ring-primary/20 transition-all p-0"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 p-2 rounded-2xl"
                >
                  <DropdownMenuLabel className="flex flex-col gap-1 p-2">
                    <span className="font-bold text-foreground">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl cursor-pointer py-2.5"
                  >
                    <Link href="/don-hang" className="flex items-center w-full">
                      <Package className="mr-2 h-4 w-4" /> Đơn hàng của tôi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl cursor-pointer py-2.5"
                  >
                    <Link href="/dia-chi" className="flex items-center w-full">
                      <MapPin className="mr-2 h-4 w-4" /> Địa chỉ của tôi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl cursor-pointer py-2.5"
                  >
                    <Link href="/quan-ly" className="flex items-center w-full">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Quản lý
                      bán/cho thuê
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="rounded-xl text-destructive focus:bg-destructive/10 cursor-pointer py-2.5"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/dang-nhap">
                <Button className="ml-2 rounded-full font-bold shadow-colored hover:-translate-y-0.5 transition-all">
                  Đăng nhập
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col w-full">{children}</main>

      <footer className="bg-secondary/40 border-t border-border mt-auto pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-1">
              <Link
                href="/"
                className="flex items-center gap-2 text-primary font-display font-bold text-2xl mb-4"
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/logo.svg`}
                  alt="Modo"
                  className="w-9 h-9 object-contain rounded-xl"
                />
                Modo
              </Link>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Nền tảng mua bán và cho thuê đồ cũ hàng đầu Việt Nam. Sống xanh,
                mua sắm thông minh cùng Modo.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-display text-foreground">
                Về chúng tôi
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Quy chế hoạt động
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-display text-foreground">
                Hỗ trợ khách hàng
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Trung tâm trợ giúp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    An toàn mua bán
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Quy định thuê đồ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-display text-foreground">
                Kết nối
              </h4>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-primary hover:scale-110 transition-transform cursor-pointer">
                  FB
                </div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-primary hover:scale-110 transition-transform cursor-pointer">
                  IG
                </div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-primary hover:scale-110 transition-transform cursor-pointer">
                  TT
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border/60 text-center text-sm text-muted-foreground">
            © 2024 Modo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
