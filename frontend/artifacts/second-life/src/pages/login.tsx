import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập email và mật khẩu",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response && response.data) {
        const {
          id,
          fullName,
          email: userEmail,
          role,
          token,
          refreshToken,
        } = response.data;
        login(
          {
            id,
            name: fullName || "Người dùng",
            fullName,
            email: userEmail,
            avatar:
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
            role,
          },
          token,
          refreshToken,
        );

        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn quay lại!",
        });

        // Điều hướng dựa trên role
        if (role && role.toUpperCase() === "ADMIN") {
          setLocation("/admin");
        } else {
          setLocation("/");
        }
      }
    } catch (err: any) {
      toast({
        title: "Đăng nhập thất bại",
        description: err.message || "Vui lòng kiểm tra lại thông tin đăng nhập",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl shadow-primary/5 border border-border/50">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center gap-2 mb-4">
            <img
              src={`${import.meta.env.BASE_URL}images/logo.svg`}
              alt="Modo"
              className="w-12 h-12 object-contain"
            />
            <span className="text-2xl font-bold font-display text-primary">
              Modo
            </span>
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground">
            Chào mừng trở lại!
          </h1>
          <p className="text-muted-foreground mt-2">
            Đăng nhập để tiếp tục mua sắm và cho thuê
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl bg-secondary/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl bg-secondary/30"
            />
            <div className="flex justify-end pt-1">
              <a
                href="#"
                className="text-sm text-primary font-medium hover:underline"
              >
                Quên mật khẩu?
              </a>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-full h-14 rounded-full font-bold text-lg shadow-colored mt-4"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>

        <p className="text-center mt-8 text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link
            href="/dang-ky"
            className="text-primary font-bold hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
