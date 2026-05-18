import React, { useState, useCallback, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useProduct, useProducts } from "@/hooks/use-products";
import { useCart } from "@/lib/context";
import { formatPrice, ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  Store,
  MessageCircle,
  ShieldCheck,
  Info,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  ShoppingCart,
  Calendar,
  Package,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ZoomIn,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import useEmblaCarousel from "embla-carousel-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTimeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const months =
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth());
  if (months <= 0) return "Vừa mới tham gia";
  if (months < 12) return `${months} tháng trước`;
  const years = Math.floor(months / 12);
  return `${years} năm trước`;
}

function StarRow({ rating, size = 5 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          style={{ width: size, height: size }}
          className={
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }
        />
      ))}
    </span>
  );
}

// ─── Image Zoom Modal ────────────────────────────────────────────────────────

function ImageZoomModal({
  images,
  startIndex,
  open,
  onClose,
}: {
  images: string[];
  startIndex: number;
  open: boolean;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  useEffect(() => {
    if (open) setCurrent(startIndex);
  }, [open, startIndex]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-999 bg-black/90 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 rounded-full p-2"
      >
        <X className="w-6 h-6" />
      </button>
      <div
        className="relative max-w-3xl max-h-[80vh] w-full flex items-center justify-center px-12"
        onClick={(e) => e.stopPropagation()}
      >
        {current > 0 && (
          <button
            onClick={() => setCurrent((c) => c - 1)}
            className="absolute left-0 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <img
          src={images[current]}
          alt=""
          className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
        />
        {current < images.length - 1 && (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className="absolute right-0 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
      <div className="flex gap-2 mt-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(i);
            }}
            className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
              i === current ? "border-white" : "border-white/30 opacity-60"
            }`}
          >
            <img src={img} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      <p className="text-white/50 text-sm mt-3">
        {current + 1} / {images.length}
      </p>
    </div>
  );
}

// ─── Main Gallery (Left block) ───────────────────────────────────────────────

function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0);
  const [thumbRef, thumbApi] = useEmblaCarousel({ dragFree: true });
  const [zoomOpen, setZoomOpen] = useState(false);

  const prev = useCallback(
    () => setCurrent((c) => (c > 0 ? c - 1 : images.length - 1)),
    [images.length],
  );
  const next = useCallback(
    () => setCurrent((c) => (c < images.length - 1 ? c + 1 : 0)),
    [images.length],
  );

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-square bg-secondary/30 rounded-3xl overflow-hidden border border-border/50 group">
        <img
          src={images[current]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {/* Zoom hint */}
        <button
          onClick={() => setZoomOpen(true)}
          className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-foreground rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-foreground rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${
                  i === current ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Slider */}
      {images.length > 1 && (
        <div className="relative">
          <div className="overflow-hidden" ref={thumbRef}>
            <div className="flex gap-2.5">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    i === current
                      ? "border-primary shadow-sm scale-105"
                      : "border-transparent opacity-60 hover:opacity-100 hover:border-border"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <ImageZoomModal
        images={images}
        startIndex={current}
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
      />
    </div>
  );
}

// ─── Review Images / Videos ──────────────────────────────────────────────────

const REVIEW_IMAGES = [
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=70",
  "https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=200&q=70",
];

function ReviewMedia({ images }: { images: string[] }) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIdx, setZoomIdx] = useState(0);
  if (!images.length) return null;
  return (
    <>
      <div className="flex gap-2 mt-3 flex-wrap">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => {
              setZoomIdx(i);
              setZoomOpen(true);
            }}
            className="w-20 h-20 rounded-xl overflow-hidden border border-border hover:border-primary transition-all hover:scale-105 relative group"
          >
            <img src={img} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
              <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>
      <ImageZoomModal
        images={images}
        startIndex={zoomIdx}
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
      />
    </>
  );
}

// ─── Recommended Slider (2 rows) ─────────────────────────────────────────────

function RecommendedSlider({ products }: { products: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    align: "start",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Split into 2 rows
  const row1 = products.filter((_, i) => i % 2 === 0).slice(0, 8);
  const row2 = products.filter((_, i) => i % 2 === 1).slice(0, 8);

  if (products.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {row1.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-4"
              style={{ minWidth: "180px", maxWidth: "200px" }}
            >
              <ProductCard product={p} />
              {row2.find((r) => r.id !== p.id) && (
                <ProductCard product={row2[row1.indexOf(p)] ?? row2[0]} />
              )}
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:shadow-lg border border-border text-foreground rounded-full p-2 hover:scale-110 transition-all z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:shadow-lg border border-border text-foreground rounded-full p-2 hover:scale-110 transition-all z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

// ─── Buy Modal ───────────────────────────────────────────────────────────────

function BuyModal({
  open,
  onClose,
  product,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  product: any;
  onConfirm: (qty: number) => void;
}) {
  const [qty, setQty] = useState(1);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden">
        <div className="bg-secondary/30 px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              Xác nhận mua hàng
            </DialogTitle>
            <DialogDescription>Chọn số lượng bạn muốn mua</DialogDescription>
          </DialogHeader>
        </div>
        <div className="px-6 py-5 space-y-5">
          {/* Product preview */}
          <div className="flex gap-3 items-center bg-secondary/20 rounded-2xl p-3">
            <img
              src={product.images[0]}
              className="w-14 h-14 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm line-clamp-2">
                {product.name}
              </p>
              <p className="text-primary font-bold mt-0.5">
                {formatPrice(product.buyPrice)}
              </p>
            </div>
          </div>

          {/* Qty stepper */}
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Số lượng</span>
            <div className="flex items-center gap-3 border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="w-10 h-10 flex items-center justify-center hover:bg-secondary/60 disabled:opacity-30 transition-colors font-bold text-lg"
              >
                −
              </button>
              <span className="font-bold text-lg w-8 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stocks, q + 1))}
                disabled={qty >= product.stocks}
                className="w-10 h-10 flex items-center justify-center hover:bg-secondary/60 disabled:opacity-30 transition-colors font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Còn lại: {product.stocks} sản phẩm
          </p>

          {/* Total */}
          <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3">
            <span className="text-muted-foreground font-medium">
              Tổng cộng:
            </span>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(product.buyPrice * qty)}
            </span>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-2xl h-12"
          >
            Hủy
          </Button>
          <Button
            onClick={() => onConfirm(qty)}
            className="flex-1 rounded-2xl h-12 shadow-colored font-bold"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Mua ngay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Rent Modal ──────────────────────────────────────────────────────────────

function RentModal({
  open,
  onClose,
  product,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  product: any;
  onConfirm: (start: Date, end: Date, qty: number) => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [qty, setQty] = useState(1);
  const [validating, setValidating] = useState(false);
  const [validResult, setValidResult] = useState<null | boolean>(null);

  const days =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 0;

  const totalPrice = days * (product.rentPricePerDay ?? 0) * qty;
  const canValidate =
    startDate && endDate && new Date(endDate) > new Date(startDate);

  const handleValidate = async () => {
    if (!canValidate) return;
    setValidating(true);
    setValidResult(null);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    // Mock: always valid for demo
    setValidResult(true);
    setValidating(false);
  };

  const handleConfirm = () => {
    if (!startDate || !endDate) return;
    onConfirm(new Date(startDate), new Date(endDate), qty);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden">
        <div className="bg-primary/5 px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              Đăng ký thuê
            </DialogTitle>
            <DialogDescription>
              Chọn thời gian và số lượng bạn muốn thuê
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Product preview */}
          <div className="flex gap-3 items-center bg-secondary/20 rounded-2xl p-3">
            <img
              src={product.images[0]}
              className="w-14 h-14 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm line-clamp-2">
                {product.name}
              </p>
              <p className="text-primary font-bold mt-0.5">
                {formatPrice(product.rentPricePerDay)}/ngày
              </p>
            </div>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                Ngày bắt đầu
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setValidResult(null);
                    if (endDate && e.target.value >= endDate) setEndDate("");
                  }}
                  className="w-full pl-9 pr-3 h-10 rounded-xl border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                Ngày kết thúc
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setValidResult(null);
                  }}
                  className="w-full pl-9 pr-3 h-10 rounded-xl border border-border bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Qty */}
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground text-sm">
              Số lượng
            </span>
            <div className="flex items-center gap-3 border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="w-9 h-9 flex items-center justify-center hover:bg-secondary/60 disabled:opacity-30 transition-colors font-bold"
              >
                −
              </button>
              <span className="font-bold w-6 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stocks, q + 1))}
                disabled={qty >= product.stocks}
                className="w-9 h-9 flex items-center justify-center hover:bg-secondary/60 disabled:opacity-30 transition-colors font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Duration info */}
          {days > 0 && (
            <div className="flex items-center justify-between text-sm bg-secondary/30 rounded-2xl px-4 py-3">
              <span className="text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" /> Thời gian thuê:
              </span>
              <span className="font-semibold">{days} ngày</span>
            </div>
          )}

          {/* Validate button */}
          <Button
            onClick={handleValidate}
            disabled={!canValidate || validating}
            variant="outline"
            className="w-full rounded-2xl h-10 border-primary/30 text-primary hover:bg-primary/5"
          >
            {validating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang kiểm tra tình trạng...
              </>
            ) : (
              "Kiểm tra tình trạng thuê"
            )}
          </Button>

          {/* Validation result */}
          {validResult === true && (
            <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-4 py-3 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Sản phẩm có sẵn trong thời gian này! Bạn có thể tiến hành thuê.
            </div>
          )}
          {validResult === false && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              Sản phẩm không còn trống trong khoảng thời gian này. Vui lòng chọn
              ngày khác.
            </div>
          )}

          {/* Total */}
          {days > 0 && (
            <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3">
              <span className="text-muted-foreground font-medium text-sm">
                Tổng cộng:
              </span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(totalPrice)}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-2xl h-12"
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canValidate || validResult !== true}
            className="flex-1 rounded-2xl h-12 font-bold"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Xác nhận thuê
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id!);
  const { data: relatedPage } = useProducts({ category: product?.category });
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);

  const handleBuyConfirm = (qty: number) => {
    addToCart({ product: product!, type: "buy", quantity: qty });
    setIsBuyModalOpen(false);
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${qty} × ${product!.name}`,
    });
    setLocation("/thanh-toan");
  };

  const handleRentConfirm = (start: Date, end: Date, qty: number) => {
    addToCart({
      product: product!,
      type: "rent",
      quantity: qty,
      startDate: start,
      endDate: end,
    });
    setIsRentModalOpen(false);
    toast({
      title: "Đã thêm vào giỏ hàng để thuê",
      description: product!.name,
    });
  };

  const handleAddToCart = () => {
    addToCart({
      product: product!,
      type: product!.buyPrice ? "buy" : "rent",
      quantity: 1,
    });
    toast({ title: "Đã thêm vào giỏ hàng", description: product!.name });
  };

  // ── Loading / Not found
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-3">
            <Skeleton className="aspect-square rounded-3xl w-full" />
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="w-16 h-16 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Không tìm thấy sản phẩm</h2>
      </div>
    );
  }

  const related2 = (relatedPage?.items ?? []).filter(
    (p) => p.id !== product.id,
  );
  const shopName = product.shop.name;
  const shopAvatar = product.shop.avatar;
  const shopAddress = product.shop.address || "";
  const shopRating = product.shop.rating ?? 0;
  const shopTotalOrders = product.shop.totalOrders ?? 0;
  const shopJoined = product.shop.joinedAt
    ? formatTimeAgo(product.shop.joinedAt)
    : "";

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/tim-kiem?category=${encodeURIComponent(product.category)}`}
            className="hover:text-primary transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium truncate max-w-50">
            {product.name}
          </span>
        </nav>

        {/* ── BLOCK 1: Images + Info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Left: Gallery */}
          <div className="lg:col-span-5">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground leading-snug">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Rating + Location + Stock */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <StarRow rating={product.rating} size={16} />
                <span className="font-bold text-foreground">
                  {product.rating}
                </span>
                <span className="text-muted-foreground underline cursor-pointer">
                  ({product.reviewsCount} đánh giá)
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                {product.location}
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Còn lại:</span>
                <span
                  className={`font-bold ${product.stocks <= 2 ? "text-red-500" : "text-foreground"}`}
                >
                  {product.stocks}
                </span>
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.buyPrice > 0 && (
                <div className="bg-secondary/40 border border-secondary rounded-2xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Giá bán
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatPrice(product.buyPrice)}
                  </p>
                  {product.aiSuggestedBuyPrice && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-100 w-fit px-2.5 py-1 rounded-lg font-medium mt-2">
                      <Info className="w-3 h-3 shrink-0" />
                      AI gợi ý: {formatPrice(product.aiSuggestedBuyPrice)}
                    </div>
                  )}
                </div>
              )}
              {product.rentPricePerDay > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Giá thuê
                  </p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(product.rentPricePerDay)}
                    </p>
                    <span className="text-muted-foreground text-sm">/ngày</span>
                  </div>
                  {product.aiSuggestedRentPrice && (
                    <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-100 w-fit px-2.5 py-1 rounded-lg font-medium mt-2">
                      <Info className="w-3 h-3 shrink-0" />
                      AI gợi ý: {formatPrice(product.aiSuggestedRentPrice)}/ngày
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action buttons — 3 in a row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {product.rentPricePerDay > 0 && (
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 rounded-2xl font-bold h-12 border-primary text-primary hover:bg-primary/10"
                  onClick={() => setIsRentModalOpen(true)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Thuê ngay
                </Button>
              )}
              {product.buyPrice > 0 && (
                <Button
                  size="lg"
                  className="flex-1 rounded-2xl font-bold h-12 shadow-colored hover:-translate-y-0.5 transition-transform"
                  onClick={() => setIsBuyModalOpen(true)}
                >
                  Mua ngay
                </Button>
              )}
              <Button
                size="lg"
                variant="secondary"
                className="flex-1 sm:flex-none rounded-2xl font-bold h-12 hover:-translate-y-0.5 transition-transform"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Thêm vào giỏ
              </Button>
            </div>

            {/* ── BLOCK 2: Shop / Facility Info ── */}
            <div className="bg-white border border-border rounded-3xl p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <Link href={`/cua-hang/${product.shop.id}`}>
                  <img
                    src={shopAvatar}
                    className="w-14 h-14 rounded-2xl object-cover border border-border hover:ring-2 hover:ring-primary/30 transition-all cursor-pointer"
                    alt={shopName}
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/cua-hang/${product.shop.id}`}>
                    <h4 className="font-bold text-base hover:text-primary transition-colors cursor-pointer">
                      {shopName}
                    </h4>
                  </Link>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{shopAddress}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {shopTotalOrders.toLocaleString("vi-VN")} đơn
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {shopRating} / 5.0
                    </span>
                    {shopJoined && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Tham gia {shopJoined}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-border/60">
                <Link href="/tin-nhan" className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> Chat ngay
                  </Button>
                </Link>
                <Link href={`/cua-hang/${product.shop.id}`} className="flex-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full rounded-xl gap-2"
                  >
                    <Store className="w-4 h-4" /> Xem shop
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── BLOCK 3: Reviews ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold font-display mb-5">
                Đánh giá sản phẩm
              </h3>

              {/* Average */}
              <div className="flex items-center gap-5 bg-secondary/30 rounded-2xl p-5 mb-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-primary">
                    {product.rating}
                  </p>
                  <StarRow rating={product.rating} size={18} />
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.reviewsCount} đánh giá
                  </p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct =
                      star === 5 ? 72 : star === 4 ? 20 : star === 3 ? 5 : 2;
                    return (
                      <div
                        key={star}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span className="w-3">{star}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground w-7">
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews list */}
              <div className="space-y-6">
                {product.reviews.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Star className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
                    <p>Chưa có đánh giá nào.</p>
                  </div>
                ) : (
                  product.reviews.map((r: any) => (
                    <div
                      key={r.id}
                      className="pb-5 border-b border-border/40 last:border-0"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={r.userAvatar}
                          className="w-10 h-10 rounded-full object-cover border border-border"
                          alt={r.userName}
                        />
                        <div>
                          <p className="font-semibold text-sm">{r.userName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarRow rating={r.rating} size={13} />
                            <span className="text-xs text-muted-foreground">
                              {new Date(r.createdAt).toLocaleDateString(
                                "vi-VN",
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Review media above, comment below */}
                      <ReviewMedia
                        images={REVIEW_IMAGES.slice(0, r.rating > 4 ? 2 : 0)}
                      />
                      <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                        {r.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Buyer protection sidebar */}
          <div className="space-y-4">
            <div className="bg-white border border-border rounded-3xl p-5 shadow-sm">
              <h4 className="font-bold flex items-center gap-2 mb-4 text-sm">
                <ShieldCheck className="text-primary w-5 h-5 shrink-0" />
                Bảo vệ người mua
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  "Hoàn tiền 100% nếu hàng không đúng mô tả",
                  "Kiểm tra hàng trước khi thanh toán",
                  "Hỗ trợ giải quyết tranh chấp 24/7",
                  "Đặt cọc 30% khi thuê, hoàn trả sau khi trả đồ",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-5">
              <h4 className="font-bold text-sm mb-3">📦 Quy định thuê đồ</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>• Đặt cọc 30% giá trị sản phẩm</li>
                <li>• Trả đồ đúng hạn đã chọn</li>
                <li>• Bồi thường nếu làm hỏng/mất</li>
                <li>• Liên hệ shop trước để gia hạn</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── BLOCK 4: Recommended Products (2-row slider) ── */}
        {related2.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold font-display mb-5">
              Sản phẩm tương tự
            </h3>
            <RecommendedSlider products={related2} />
          </div>
        )}
      </div>

      {/* Buy Modal */}
      {product.buyPrice > 0 && (
        <BuyModal
          open={isBuyModalOpen}
          onClose={() => setIsBuyModalOpen(false)}
          product={product}
          onConfirm={handleBuyConfirm}
        />
      )}

      {/* Rent Modal */}
      {product.rentPricePerDay > 0 && (
        <RentModal
          open={isRentModalOpen}
          onClose={() => setIsRentModalOpen(false)}
          product={product}
          onConfirm={handleRentConfirm}
        />
      )}
    </div>
  );
}
