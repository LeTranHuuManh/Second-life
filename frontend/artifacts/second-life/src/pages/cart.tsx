import React, { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useCart, CartItem } from "@/lib/context";
import { formatPrice } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2, Minus, Plus, CalendarDays, ShoppingBag, AlertCircle } from "lucide-react";

interface RowState {
  buyChecked: boolean;
  rentChecked: boolean;
  buyQty: number;
  rentStart: string;
  rentEnd: string;
  qtyError: string | null;
  dateError: string | null;
}

function toDateInput(date?: Date): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

function rentDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return diff > 0 ? Math.ceil(diff / 86400000) : 0;
}

function groupByDate(items: CartItem[]): Map<string, CartItem[]> {
  const map = new Map<string, CartItem[]>();
  [...items]
    .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
    .forEach((item) => {
      const key = item.addedAt.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });
  return map;
}

export default function Cart() {
  const { items, removeFromCart } = useCart();
  const [, setLocation] = useLocation();

  const [states, setStates] = useState<Record<string, RowState>>(() => {
    const init: Record<string, RowState> = {};
    items.forEach((item) => {
      init[item.id] = {
        buyChecked: item.type === "buy",
        rentChecked: item.type === "rent",
        buyQty: item.quantity || 1,
        rentStart: toDateInput(item.startDate),
        rentEnd: toDateInput(item.endDate),
        qtyError: null,
        dateError: null,
      };
    });
    return init;
  });

  const get = (id: string): RowState =>
    states[id] ?? {
      buyChecked: false,
      rentChecked: false,
      buyQty: 1,
      rentStart: "",
      rentEnd: "",
      qtyError: null,
      dateError: null,
    };

  const update = (id: string, patch: Partial<RowState>) =>
    setStates((prev) => ({ ...prev, [id]: { ...get(id), ...patch } }));

  const changeQty = (item: CartItem, delta: number) => {
    const s = get(item.id);
    const next = Math.max(1, s.buyQty + delta);
    if (next > item.product.stock) {
      update(item.id, { qtyError: `Chỉ còn ${item.product.stock} sản phẩm trong kho` });
    } else {
      update(item.id, { buyQty: next, qtyError: null });
    }
  };

  const changeDate = (id: string, field: "rentStart" | "rentEnd", value: string) => {
    const s = get(id);
    const next = { ...s, [field]: value, dateError: null };
    if (next.rentStart && next.rentEnd && new Date(next.rentEnd) <= new Date(next.rentStart)) {
      next.dateError = "Ngày trả phải sau ngày bắt đầu" as any;
    }
    update(id, next);
  };

  const groups = useMemo(() => groupByDate(items), [items]);

  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      const s = get(item.id);
      let sub = 0;
      if (s.buyChecked && (item.product.type === "buy" || item.product.type === "both")) {
        sub += (item.product.buyPrice ?? 0) * s.buyQty;
      }
      if (s.rentChecked && (item.product.type === "rent" || item.product.type === "both")) {
        const days = rentDays(s.rentStart, s.rentEnd);
        sub += (item.product.rentPricePerDay ?? 0) * Math.max(days, 1);
      }
      return acc + sub;
    }, 0);
  }, [items, states]);

  const checkedCount = useMemo(() => {
    return items.reduce((acc, item) => {
      const s = get(item.id);
      if (s.buyChecked) acc++;
      if (s.rentChecked) acc++;
      return acc;
    }, 0);
  }, [items, states]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <img
          src={`${import.meta.env.BASE_URL}images/empty-cart.png`}
          alt="Giỏ hàng trống"
          className="w-64 h-64 object-contain mb-8"
        />
        <h2 className="text-3xl font-bold font-display mb-4">Giỏ hàng của bạn đang trống</h2>
        <p className="text-muted-foreground mb-8">
          Hãy khám phá các sản phẩm tuyệt vời trên Modo nhé!
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-full shadow-colored px-8">
            Khám phá ngay
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold font-display mb-2">Giỏ hàng</h1>
      <p className="text-sm text-muted-foreground mb-8">{items.length} sản phẩm</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {[...groups.entries()].map(([dateLabel, groupItems]) => (
            <div key={dateLabel}>
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Thêm vào {dateLabel}
                </span>
              </div>

              <div className="space-y-3">
                {groupItems.map((item) => {
                  const s = get(item.id);
                  const pt = item.product.type;

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-border/60 rounded-2xl shadow-sm overflow-hidden"
                    >
                      {/* Product header row */}
                      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border/40">
                        <Link href={`/san-pham/${item.product.id}`} className="shrink-0">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary">
                            <img
                              src={item.product.images[0]}
                              className="w-full h-full object-cover"
                              alt={item.product.name}
                            />
                          </div>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/san-pham/${item.product.id}`}>
                            <h3 className="font-semibold text-sm text-foreground line-clamp-1 hover:text-primary transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.product.shop.name}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {pt === "both" && (
                            <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">Mua & Thuê</Badge>
                          )}
                          {pt === "buy" && (
                            <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">Chỉ mua</Badge>
                          )}
                          {pt === "rent" && (
                            <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">Chỉ thuê</Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Buy sub-row */}
                      {(pt === "buy" || pt === "both") && (
                        <div
                          className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                            s.buyChecked ? "" : "opacity-50"
                          } ${pt === "both" ? "border-b border-border/30" : ""}`}
                        >
                          <Checkbox
                            id={`buy-${item.id}`}
                            checked={s.buyChecked}
                            onCheckedChange={(v) => update(item.id, { buyChecked: !!v, qtyError: null })}
                          />
                          <label
                            htmlFor={`buy-${item.id}`}
                            className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full cursor-pointer select-none"
                          >
                            Mua
                          </label>
                          <span className="text-sm text-muted-foreground flex-1">
                            {formatPrice(item.product.buyPrice ?? 0)} / cái
                          </span>

                          {/* Qty adjuster */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-lg"
                              disabled={!s.buyChecked || s.buyQty <= 1}
                              onClick={() => changeQty(item, -1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-semibold tabular-nums">
                              {s.buyQty}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-lg"
                              disabled={!s.buyChecked || s.buyQty >= item.product.stock}
                              onClick={() => changeQty(item, +1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          <span className="text-sm font-bold text-primary w-28 text-right">
                            {formatPrice((item.product.buyPrice ?? 0) * s.buyQty)}
                          </span>
                        </div>
                      )}

                      {/* Buy qty error */}
                      {s.qtyError && (
                        <div className="flex items-center gap-1.5 px-4 pb-2 text-xs text-destructive">
                          <AlertCircle className="w-3 h-3" />
                          {s.qtyError}
                        </div>
                      )}

                      {/* Rent sub-row */}
                      {(pt === "rent" || pt === "both") && (
                        <div
                          className={`flex items-center gap-3 px-4 py-3 flex-wrap transition-colors ${
                            s.rentChecked ? "" : "opacity-50"
                          }`}
                        >
                          <Checkbox
                            id={`rent-${item.id}`}
                            checked={s.rentChecked}
                            onCheckedChange={(v) => update(item.id, { rentChecked: !!v, dateError: null })}
                          />
                          <label
                            htmlFor={`rent-${item.id}`}
                            className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full cursor-pointer select-none"
                          >
                            Thuê
                          </label>
                          <span className="text-sm text-muted-foreground">
                            {formatPrice(item.product.rentPricePerDay ?? 0)} / ngày
                          </span>

                          <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-muted-foreground whitespace-nowrap">Bắt đầu:</span>
                              <input
                                type="date"
                                disabled={!s.rentChecked}
                                value={s.rentStart}
                                min={new Date().toISOString().slice(0, 10)}
                                onChange={(e) => changeDate(item.id, "rentStart", e.target.value)}
                                className="text-xs border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed bg-white"
                              />
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-muted-foreground whitespace-nowrap">Trả hàng:</span>
                              <input
                                type="date"
                                disabled={!s.rentChecked}
                                value={s.rentEnd}
                                min={s.rentStart || new Date().toISOString().slice(0, 10)}
                                onChange={(e) => changeDate(item.id, "rentEnd", e.target.value)}
                                className="text-xs border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed bg-white"
                              />
                            </div>

                            <div className="flex flex-col items-end">
                              {rentDays(s.rentStart, s.rentEnd) > 0 ? (
                                <span className="text-sm font-bold text-primary w-28 text-right">
                                  {formatPrice(
                                    (item.product.rentPricePerDay ?? 0) * rentDays(s.rentStart, s.rentEnd)
                                  )}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground w-28 text-right">Chọn ngày</span>
                              )}
                              {rentDays(s.rentStart, s.rentEnd) > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {rentDays(s.rentStart, s.rentEnd)} ngày
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Date error */}
                      {s.dateError && (
                        <div className="flex items-center gap-1.5 px-4 pb-2 text-xs text-destructive">
                          <AlertCircle className="w-3 h-3" />
                          {s.dateError}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-border/50 p-6 rounded-2xl sticky top-24 shadow-sm">
            <h3 className="text-lg font-bold font-display mb-5">Tóm tắt đơn hàng</h3>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Đã chọn ({checkedCount} lựa chọn)
                </span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span className="font-medium text-emerald-600">Chưa tính</span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-end">
                <span className="font-bold">Tổng cộng</span>
                <span className="font-bold text-2xl text-primary">{formatPrice(total)}</span>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full rounded-full font-bold text-base h-12 shadow-colored"
              disabled={checkedCount === 0}
              onClick={() => setLocation("/thanh-toan")}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Tiến hành thanh toán
            </Button>
            {checkedCount === 0 && (
              <p className="text-xs text-center text-muted-foreground mt-3">
                Vui lòng chọn ít nhất một sản phẩm
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
