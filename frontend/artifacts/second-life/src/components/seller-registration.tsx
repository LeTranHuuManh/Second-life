import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/context";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SellerRegistration() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    shopName: "",
    phone: "",
    address: "",
  });

  const checkStatus = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/seller-requests/my-status");
      if (res && res.data) {
        setStatus(res.data.status); // PENDING, APPROVED, REJECTED
      }
    } catch (error: any) {
      console.log("No registration found or error:", error);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "USER") {
      checkStatus();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shopName || !formData.phone || !formData.address) {
      toast({
        title: "Vui lòng điền đầy đủ",
        description:
          "Các trường Tên shop, Số điện thoại, Địa chỉ không được để trống",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await apiFetch("/seller-requests/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      toast({
        title: "Đăng ký thành công",
        description:
          "Yêu cầu của bạn đã được gửi. Vui lòng chờ quản trị viên duyệt.",
      });
      setStatus("PENDING");
    } catch (error: any) {
      toast({
        title: "Lỗi đăng ký",
        description: error.message || "Không thể gửi dữ liệu",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="bg-white p-8 rounded-3xl border border-amber-200 bg-amber-50/50 shadow-sm max-w-2xl mx-auto mt-10 text-center">
        <h2 className="text-2xl font-display font-bold text-amber-700 mb-4">
          Đang chờ xét duyệt
        </h2>
        <p className="text-amber-900/80 mb-6">
          Yêu cầu đăng ký trở thành Người bán của bạn ({user?.name}) đang được
          Quản trị viên xem xét. Vui lòng quay lại sau!
        </p>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={checkStatus}
        >
          Kiểm tra lại trạng thái
        </Button>
      </div>
    );
  }

  if (status === "REJECTED") {
    // Could show a message, but for simplicity, let them try again.
    // In our backend, if it exists as REJECTED, does the backend let them submit again?
    // Wait, backend logic `existsByUserIdAndStatus(userId, PENDING)` blocks ONLY if PENDING.
    // So if REJECTED, they can submit again!
  }

  if (status === "APPROVED") {
    return (
      <div className="bg-white p-8 rounded-3xl border border-emerald-200 bg-emerald-50/50 shadow-sm max-w-2xl mx-auto mt-10 text-center">
        <h2 className="text-2xl font-display font-bold text-emerald-700 mb-4">
          Chúc mừng! Yêu cầu đã được duyệt
        </h2>
        <p className="text-emerald-900/80 mb-6">
          Bạn đã chính thức trở thành Người bán trên hệ thống Modo. Cập nhật
          trạng thái để vào trang Quản lý.
        </p>
        <Button
          className="rounded-full shadow-colored font-bold px-8"
          onClick={() => {
            if (user) {
              const updatedUser = { ...user, role: "SELLER" };
              login(
                updatedUser,
                localStorage.getItem("second_life_token") || undefined,
                localStorage.getItem("second_life_refresh_token") || undefined,
              );
              window.location.reload();
            }
          }}
        >
          Vào trang Quản lý
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-3xl border border-border shadow-sm mt-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold font-display">Đăng Ký Bán Hàng</h2>
        <p className="text-muted-foreground mt-2">
          Mang sản phẩm của bạn đến với hàng ngàn khách hàng trên hệ thống của
          chúng tôi.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Tên cửa hàng (Shop)
          </label>
          <Input
            placeholder="Ví dụ: Cửa hàng Nam Long"
            value={formData.shopName}
            onChange={(e) =>
              setFormData({ ...formData, shopName: e.target.value })
            }
            className="rounded-xl h-11"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Số điện thoại liên hệ
          </label>
          <Input
            placeholder="0912..."
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="rounded-xl h-11"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Địa chỉ kho / shop
          </label>
          <Textarea
            placeholder="Nhập địa chỉ cụ thể..."
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="rounded-xl min-h-[100px]"
          />
        </div>

        <Button
          type="submit"
          className="w-full rounded-xl h-12 text-base font-bold shadow-colored hover:-translate-y-0.5 transition-all"
          disabled={submitting}
        >
          {submitting ? "Đang xử lý..." : "Gửi yêu cầu đăng ký"}
        </Button>
      </form>
    </div>
  );
}
