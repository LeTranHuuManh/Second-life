import React, { useState, useRef } from "react";
import { useOrders, useConfirmReceived, useSubmitReview, Order } from "@/hooks/use-orders";
import { formatPrice } from "@/components/product-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Star,
  PackageCheck,
  Truck,
  Loader2,
  Clock,
  CheckCircle2,
  Settings2,
  ImagePlus,
  X,
  ShoppingBag,
} from "lucide-react";

// ─── status config ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Chờ duyệt",
    color: "bg-amber-100 text-amber-700",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  processing: {
    label: "Đang thực hiện",
    color: "bg-blue-100 text-blue-700",
    icon: <Settings2 className="w-3.5 h-3.5" />,
  },
  shipping: {
    label: "Đang giao hàng",
    color: "bg-violet-100 text-violet-700",
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  delivered: {
    label: "Chờ xác nhận",
    color: "bg-orange-100 text-orange-700",
    icon: <PackageCheck className="w-3.5 h-3.5" />,
  },
  completed: {
    label: "Hoàn thành",
    color: "bg-emerald-100 text-emerald-700",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
};

// ─── Star picker ─────────────────────────────────────────────────────────────

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const LABELS = ["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-9 h-9 transition-colors ${
                n <= (hover || value)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-sm font-medium text-muted-foreground h-5">
        {LABELS[hover || value] ?? ""}
      </span>
    </div>
  );
}

// ─── Media preview thumbnail ─────────────────────────────────────────────────

function MediaThumb({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  const url = URL.createObjectURL(file);
  const isVideo = file.type.startsWith("video/");
  return (
    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border group">
      {isVideo ? (
        <video src={url} className="w-full h-full object-cover" />
      ) : (
        <img src={url} className="w-full h-full object-cover" alt={file.name} />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Review modal ─────────────────────────────────────────────────────────────

function ReviewModal({
  order,
  open,
  onClose,
}: {
  order: Order;
  open: boolean;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutate: submit, isPending } = useSubmitReview();

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...chosen].slice(0, 5));
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    submit(
      { orderId: order.id, rating, comment },
      {
        onSuccess: () => {
          onClose();
          setRating(0);
          setComment("");
          setFiles([]);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-bold font-display">Đánh giá đơn hàng</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Chia sẻ trải nghiệm của bạn để giúp người mua khác.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Product preview */}
          <div className="flex items-center gap-3 bg-secondary/40 rounded-2xl p-3">
            <img
              src={order.items[0].product.images[0]}
              className="w-12 h-12 rounded-xl object-cover border border-border"
              alt=""
            />
            <div className="min-w-0">
              <p className="font-semibold text-sm line-clamp-1">
                {order.items[0].product.name}
              </p>
              <p className="text-xs text-muted-foreground">Mã ĐH: {order.id}</p>
            </div>
          </div>

          {/* Stars */}
          <div>
            <p className="text-sm font-medium mb-3 text-center">Bạn cảm thấy thế nào?</p>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          {/* Media upload */}
          <div>
            <p className="text-sm font-medium mb-2">Ảnh / Video (tối đa 5 file)</p>
            <div className="flex flex-wrap gap-2">
              {files.map((f, i) => (
                <MediaThumb
                  key={i}
                  file={f}
                  onRemove={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                />
              ))}
              {files.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground hover:text-primary"
                >
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-[10px]">Thêm</span>
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFiles}
            />
          </div>

          {/* Comment */}
          <div>
            <p className="text-sm font-medium mb-2">Nhận xét của bạn</p>
            <Textarea
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="rounded-2xl resize-none text-sm"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={onClose}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 rounded-full font-bold"
            disabled={rating === 0 || isPending}
            onClick={handleSubmit}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Gửi đánh giá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Order card ───────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const { mutate: confirm, isPending: confirming } = useConfirmReceived();
  const [reviewOpen, setReviewOpen] = useState(false);

  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;

  const createdDate = new Date(order.createdAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <div className="bg-white border border-border/60 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-secondary/20">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground font-medium">
              {order.id}
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">· {createdDate}</span>
          </div>
          <Badge
            className={`${cfg.color} border-0 text-xs flex items-center gap-1 px-2.5 py-1`}
          >
            {cfg.icon}
            {cfg.label}
          </Badge>
        </div>

        {/* Items */}
        <div className="divide-y divide-border/30 px-5">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 py-4">
              <img
                src={item.product.images[0]}
                className="w-16 h-16 rounded-xl object-cover border border-border shrink-0"
                alt={item.product.name}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground line-clamp-1">
                  {item.product.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {item.type === "buy" ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-0 text-xs">Mua</Badge>
                  ) : (
                    <Badge className="bg-blue-50 text-blue-700 border-0 text-xs">Thuê</Badge>
                  )}
                  {item.type === "rent" && item.rentStart && item.rentEnd && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.rentStart).toLocaleDateString("vi-VN")} →{" "}
                      {new Date(item.rentEnd).toLocaleDateString("vi-VN")}
                    </span>
                  )}
                  {item.type === "buy" && (
                    <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                  )}
                </div>
              </div>
              <div className="text-sm font-bold text-foreground shrink-0">
                {formatPrice(
                  item.type === "buy"
                    ? (item.product.buyPrice ?? 0) * item.quantity
                    : item.product.rentPricePerDay ?? 0
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border/40 bg-secondary/10">
          <div className="text-sm text-muted-foreground">
            Tổng:{" "}
            <span className="text-lg font-bold text-primary ml-1">
              {formatPrice(order.total)}
            </span>
          </div>

          <div className="flex gap-2">
            {/* Delivered → confirm received */}
            {order.status === "delivered" && (
              <Button
                size="sm"
                className="rounded-full font-bold bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => confirm(order.id)}
                disabled={confirming}
              >
                {confirming ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                ) : (
                  <PackageCheck className="w-3.5 h-3.5 mr-1.5" />
                )}
                Đã nhận được hàng
              </Button>
            )}

            {/* Completed + not reviewed → review */}
            {order.status === "completed" && !order.reviewed && (
              <Button
                size="sm"
                variant="outline"
                className="rounded-full font-bold border-amber-400 text-amber-600 hover:bg-amber-50"
                onClick={() => setReviewOpen(true)}
              >
                <Star className="w-3.5 h-3.5 mr-1.5 fill-amber-400 text-amber-400" />
                Đánh giá
              </Button>
            )}

            {/* Completed + already reviewed */}
            {order.status === "completed" && order.reviewed && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground px-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Đã đánh giá
              </span>
            )}

            <Button size="sm" variant="ghost" className="rounded-full text-muted-foreground text-xs">
              Mua lại
            </Button>
          </div>
        </div>
      </div>

      <ReviewModal
        order={order}
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
      />
    </>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyOrders({ label }: { label: string }) {
  return (
    <div className="text-center py-16 text-muted-foreground">
      <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
      <p className="font-medium">Không có đơn {label} nào</p>
    </div>
  );
}

// ─── Tab content ──────────────────────────────────────────────────────────────

function OrderList({
  orders,
  filter,
  emptyLabel,
}: {
  orders: Order[];
  filter?: Order["status"] | "all";
  emptyLabel: string;
}) {
  const filtered =
    !filter || filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  if (filtered.length === 0) return <EmptyOrders label={emptyLabel} />;

  return (
    <div className="space-y-4">
      {filtered.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS = [
  { value: "all", label: "Tất cả", filter: "all" as const, emptyLabel: "" },
  { value: "pending", label: "Chờ duyệt", filter: "pending" as const, emptyLabel: "chờ duyệt" },
  { value: "processing", label: "Đang thực hiện", filter: "processing" as const, emptyLabel: "đang thực hiện" },
  { value: "shipping", label: "Đang giao hàng", filter: "shipping" as const, emptyLabel: "đang giao" },
  { value: "delivered", label: "Chờ xác nhận", filter: "delivered" as const, emptyLabel: "chờ xác nhận" },
  { value: "completed", label: "Hoàn thành", filter: "completed" as const, emptyLabel: "hoàn thành" },
];

export default function Orders() {
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold font-display mb-2">Đơn hàng của tôi</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {orders?.length ?? 0} đơn hàng
      </p>

      <Tabs defaultValue="all" className="w-full">
        <div className="overflow-x-auto pb-2 mb-6">
          <TabsList className="bg-secondary/50 rounded-xl p-1 h-11 inline-flex w-auto min-w-full">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 h-9 text-sm whitespace-nowrap"
              >
                {t.label}
                {orders && t.value !== "all" && (
                  <span className="ml-1.5 text-xs bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 leading-none">
                    {orders.filter((o) => o.status === t.value).length}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {TABS.map((t) => (
          <TabsContent key={t.value} value={t.value}>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <OrderList
                orders={orders ?? []}
                filter={t.filter}
                emptyLabel={t.emptyLabel}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
