import React from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/lib/context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectPath?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectPath = "/dang-nhap",
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Đang tải thông tin auth từ localStorage / API
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Chưa đăng nhập
  if (!user) {
    return <Redirect to={redirectPath} />;
  }

  // Có yêu cầu check role
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user.role || "").toUpperCase();
    const hasRole = allowedRoles.map((r) => r.toUpperCase()).includes(userRole);

    // Không có quyền
    if (!hasRole) {
      return <Redirect to="/" />;
    }
  }

  return <>{children}</>;
}
