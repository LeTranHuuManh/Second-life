import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/context";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  ShoppingCart,
  BrainCircuit,
  Settings,
  LogOut,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const ADMIN_NAVIGATION = [
  { name: "Tổng quan", href: "/", icon: LayoutDashboard },
  { name: "Người dùng", href: "/users", icon: Users },
  { name: "Duyệt Bán hàng", href: "/seller-requests", icon: Users },
  { name: "Sản phẩm", href: "/products", icon: ShoppingBag },
  { name: "Đơn hàng & Giao dịch", href: "/orders", icon: ShoppingCart },
  { name: "AI Gợi ý Giá", href: "/ai-logs", icon: BrainCircuit },
  { name: "Cài đặt & Hệ thống", href: "/settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [currentLocation] = useLocation();
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Giả sử có 1 endpoint logout, nếu không có thì đoạn apiFetch này cũng an toàn
      await apiFetch("/auth/logout", {
        method: "POST",
      }).catch(() => {}); // catch để phòng trường hợp BE chưa có API logout

      logout();
      toast({
        title: "Đăng xuất thành công",
        description: "Hẹn gặp lại bạn lần sau!",
      });
      // Dùng window.location.href để thoát khỏi nested router (/admin) về thẳng root
      window.location.href = "/dang-nhap";
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: "Không thể đăng xuất",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        {/* Admin Sidebar */}
        <Sidebar variant="sidebar">
          <SidebarHeader className="p-4 flex flex-row items-center justify-center gap-2 mb-2">
            <img
              src={`${import.meta.env.BASE_URL}images/logo.svg`}
              alt="Modo"
              className="w-10 h-10 object-contain rounded"
            />
            <span className="font-bold text-xl text-primary font-display tracking-tight flex-1">
              Modo Admin
            </span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                {ADMIN_NAVIGATION.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        currentLocation === item.href ||
                        (item.href !== "/" &&
                          currentLocation.startsWith(item.href))
                      }
                      tooltip={item.name}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Admin Content Container */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b flex items-center justify-between px-4 bg-background shrink-0 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-4 h-4 ml-4" />
              <span className="font-semibold text-sm">Portal Quản trị</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground mr-2">
                Xin chào, {user?.name || "Admin"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? "Đang xử lý..." : "Đăng xuất"}
              </Button>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-4 md:p-6 bg-muted/20">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
