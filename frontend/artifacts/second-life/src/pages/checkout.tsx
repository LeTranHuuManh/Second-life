import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useCart } from "@/lib/context";
import { useCreateOrder } from "@/hooks/use-orders";
import { useAddresses } from "@/hooks/use-addresses";
import { formatPrice } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, MapPin, Plus, AlertCircle } from "lucide-react";

export default function Checkout() {
  const { items, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const createOrder = useCreateOrder();
  const { data: addresses, isLoading: addressLoading } = useAddresses();
  const [successOpen, setSuccessOpen] = useState(false);

  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedLocationId) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedLocationId(defaultAddr.id);
    }
  }, [addresses]);

  const selectedAddress = addresses?.find((a) => a.id === selectedLocationId);

  const total = items.reduce((acc, item) => {
    if (item.type === "buy")
      return acc + (item.product.buyPrice || 0) * item.quantity;
    if (item.type === "rent") {
      const days =
        item.startDate && item.endDate
          ? Math.ceil(
              (item.endDate.getTime() - item.startDate.getTime()) /
                (1000 * 3600 * 24),
            )
          : 1;
      return acc + (item.product.rentPricePerDay || 0) * days;
    }
    return acc;
  }, 0);

  const deposit = total * 0.3; // 30% deposit rule for Second Life

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress) {
      alert("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }
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
      <h1 className="text-3xl font-bold font-display mb-8 text-center">
        Thanh toán an toàn
      </h1>

      <form
        onSubmit={handleCheckout}
        className="grid grid-cols-1 md:grid-cols-2 gap-10"
      >
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-3xl border border-border shadow-sm">
            <h3 className="text-xl font-bold font-display mb-4">
              Thông tin nhận hàng
            </h3>

            {addressLoading ? (
              <p className="text-muted-foreground text-sm">
                Đang tải địa chỉ...
              </p>
            ) : !addresses || addresses.length === 0 ? (
              <div className="text-center p-6 border border-dashed rounded-2xl bg-secondary/10">
                <MapPin className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-muted-foreground mb-4">
                  Bạn chưa có địa chỉ giao hàng.
                </p>
                <Link href="/dia-chi">
                  <Button variant="outline" className="rounded-full">
                    Thêm địa chỉ ngay
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${
                      selectedLocationId === addr.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:bg-secondary/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="mt-1"
                      checked={selectedLocationId === addr.id}
                      onChange={() => setSelectedLocationId(addr.id)}
                    />
                    <div>
                      <p className="font-bold flex items-center gap-2">
                        {addr.name}
                        {addr.isDefault && (
                          <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full">
                            Mặc định
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-foreground my-1">
                        {addr.phoneNumber}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {addr.address}
                      </p>
                    </div>
                  </label>
                ))}

                <div className="pt-2">
                  <Link href="/dia-chi">
                    <Button
                      variant="ghost"
                      className="text-primary rounded-full px-0 hover:bg-transparent hover:text-primary/80"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Quản lý địa chỉ
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </section>

          <section className="bg-white p-6 rounded-3xl border border-border shadow-sm">
            <h3 className="text-xl font-bold font-display mb-4">
              Phương thức thanh toán
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-primary bg-primary/5 rounded-2xl cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  defaultChecked
                  className="w-4 h-4 text-primary"
                />
                <span className="font-medium">
                  Chuyển khoản ngân hàng / VNPay
                </span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-border rounded-2xl cursor-pointer hover:bg-secondary/20">
                <input
                  type="radio"
                  name="payment"
                  className="w-4 h-4 text-primary"
                />
                <span className="font-medium">Thẻ tín dụng / Ghi nợ</span>
              </label>
            </div>
          </section>
        </div>

        <div>
          <div className="bg-secondary/30 p-6 rounded-3xl border border-border/50 sticky top-24">
            <h3 className="text-xl font-bold font-display mb-6">
              Đơn hàng ({items.length})
            </h3>
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <img
                    src={item.product.images[0]}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {item.type === "buy" ? "Mua" : "Thuê"}
                    </p>
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
              {createOrder.isPending
                ? "Đang xử lý..."
                : `Thanh toán cọc ${formatPrice(deposit)}`}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Bằng việc đặt hàng, bạn đồng ý với Điều khoản của Second Life.
            </p>
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
          <DialogTitle className="text-2xl font-bold font-display mb-2">
            Đặt hàng thành công!
          </DialogTitle>
          <p className="text-muted-foreground mb-8">
            Cảm ơn bạn đã tin tưởng Second Life. Đơn hàng của bạn đang được shop
            chuẩn bị.
          </p>
          <Button
            size="lg"
            className="w-full rounded-full"
            onClick={closeSuccess}
          >
            Xem đơn hàng
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
