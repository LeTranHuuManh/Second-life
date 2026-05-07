import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, fullName }),
      });

      if (response) {
        toast({
          title: "Đăng ký thành công",
          description: "Vui lòng đăng nhập để tiếp tục.",
        });
        setLocation("/dang-nhap");
      }
    } catch (err: any) {
      toast({
        title: "Đăng ký thất bại",
        description: err.message || "Vui lòng kiểm tra lại thông tin",
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
            Tạo tài khoản
          </h1>
          <p className="text-muted-foreground mt-2">Gia nhập cộng đồng Modo</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              required
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-12 rounded-xl bg-secondary/30"
            />
          </div>
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
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-full h-14 rounded-full font-bold text-lg shadow-colored mt-4"
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </form>

        <p className="text-center mt-8 text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link
            href="/dang-nhap"
            className="text-primary font-bold hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
