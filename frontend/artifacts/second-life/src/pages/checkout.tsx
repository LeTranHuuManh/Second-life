import React, { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/lib/context";
import { useCreateOrder } from "@/hooks/use-orders";
import { formatPrice } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Checkout() {
  const { items, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const createOrder = useCreateOrder();
  const [successOpen, setSuccessOpen] = useState(false);

  const total = items.reduce((acc, item) => {
    if (item.type === "buy") return acc + (item.product.buyPrice || 0) * item.quantity;
    if (item.type === "rent") {
      const days = item.startDate && item.endDate 
        ? Math.ceil((item.endDate.getTime() - item.startDate.getTime()) / (1000 * 3600 * 24)) 
        : 1;
      return acc + (item.product.rentPricePerDay || 0) * days;
    }
    return acc;
  }, 0);

  const deposit = total * 0.3; // 30% deposit rule for Second Life

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrder.mutateAsync({
      items,
      total,
      status: "pending",
    });
    setSuccessOpen(true);
  };

  const closeSuccess = () => {
    setSuccessOpen(false);
    clearCart();
    setLocation("/don-hang");
  };

  if (items.length === 0 && !successOpen) {
    setLocation("/");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold font-display mb-8 text-center">Thanh toán an toàn</h1>
      
      <form onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-3xl border border-border shadow-sm">
            <h3 className="text-xl font-bold font-display mb-4">Thông tin nhận hàng</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input id="name" required className="rounded-xl bg-secondary/20" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" type="tel" required className="rounded-xl bg-secondary/20" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Địa chỉ giao hàng</Label>
                <Input id="address" required className="rounded-xl bg-secondary/20" />
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-border shadow-sm">
            <h3 className="text-xl font-bold font-display mb-4">Phương thức thanh toán</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-primary bg-primary/5 rounded-2xl cursor-pointer">
                <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-primary" />
                <span className="font-medium">Chuyển khoản ngân hàng / VNPay</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-border rounded-2xl cursor-pointer hover:bg-secondary/20">
                <input type="radio" name="payment" className="w-4 h-4 text-primary" />
                <span className="font-medium">Thẻ tín dụng / Ghi nợ</span>
              </label>
            </div>
          </section>
        </div>

        <div>
          <div className="bg-secondary/30 p-6 rounded-3xl border border-border/50 sticky top-24">
            <h3 className="text-xl font-bold font-display mb-6">Đơn hàng ({items.length})</h3>
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <img src={item.product.images[0]} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.product.name}</p>
                    <p className="text-muted-foreground text-xs">{item.type === 'buy' ? 'Mua' : 'Thuê'}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border/80 pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Tổng tiền hàng</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-200">
                <span>Đặt cọc an toàn (30%)</span>
                <span className="font-bold">{formatPrice(deposit)}</span>
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              disabled={createOrder.isPending}
              className="w-full rounded-full font-bold text-lg h-14 mt-6 shadow-colored"
            >
              {createOrder.isPending ? "Đang xử lý..." : `Thanh toán cọc ${formatPrice(deposit)}`}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">Bằng việc đặt hàng, bạn đồng ý với Điều khoản của Second Life.</p>
          </div>
        </div>
      </form>

      <Dialog open={successOpen} onOpenChange={closeSuccess}>
        <DialogContent className="sm:max-w-md rounded-3xl text-center p-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold font-display mb-2">Đặt hàng thành công!</DialogTitle>
          <p className="text-muted-foreground mb-8">Cảm ơn bạn đã tin tưởng Second Life. Đơn hàng của bạn đang được shop chuẩn bị.</p>
          <Button size="lg" className="w-full rounded-full" onClick={closeSuccess}>
            Xem đơn hàng
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
