import React from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";

export function formatPrice(price: number | undefined) {
  if (!price) return "N/A";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

interface ProductCardProps {
  product: {
    id: number | string;
    title?: string;
    name?: string;
    listingType?: string;
    type?: "buy" | "rent" | "both";
    price?: number | { toNumber?: () => number };
    rentalPricePerDay?: number | { toNumber?: () => number };
    buyPrice?: number;
    rentPricePerDay?: number;
    images?: string[];
    location?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  // Xử lý trường hợp price là BigDecimal object từ API
  const getPrice = (value: any) => {
    if (!value) return undefined;
    return typeof value === "object" && value.toNumber
      ? value.toNumber()
      : Number(value);
  };

  const price = getPrice(product.price ?? product.buyPrice);
  const rentalPricePerDay = getPrice(
    product.rentalPricePerDay ?? product.rentPricePerDay,
  );
  const imageUrl =
    product.images?.[0] || `${import.meta.env.BASE_URL}images/placeholder.png`;
  const productTitle = product.title || product.name || "Sản phẩm";
  const listingType =
    product.listingType ||
    (product.type === "buy"
      ? "SELL"
      : product.type === "rent"
        ? "RENT"
        : "SELL_AND_RENT");

  return (
    <Link href={`/san-pham/${product.id}`} className="block group h-full">
      <div className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-secondary/30">
          <img
            src={imageUrl}
            alt={productTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.currentTarget.src = `${import.meta.env.BASE_URL}images/placeholder.png`;
            }}
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {(listingType === "SELL" || listingType === "SELL_AND_RENT") && (
              <Badge
                variant="secondary"
                className="bg-white/90 backdrop-blur-sm text-emerald-700 hover:bg-white font-bold border-none shadow-sm"
              >
                Mua
              </Badge>
            )}
            {(listingType === "RENT" || listingType === "SELL_AND_RENT") && (
              <Badge
                variant="secondary"
                className="bg-white/90 backdrop-blur-sm text-blue-700 hover:bg-white font-bold border-none shadow-sm"
              >
                Thuê
              </Badge>
            )}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-foreground line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
            {productTitle}
          </h3>

          <div className="mt-auto space-y-2">
            {price && (
              <div className="flex items-end gap-1.5">
                <span className="text-sm text-muted-foreground font-medium w-10">
                  Mua:
                </span>
                <span className="text-lg font-bold text-foreground">
                  {formatPrice(price)}
                </span>
              </div>
            )}
            {rentalPricePerDay && (
              <div className="flex items-end gap-1.5">
                <span className="text-sm text-muted-foreground font-medium w-10">
                  Thuê:
                </span>
                <span className="text-base font-bold text-primary">
                  {formatPrice(rentalPricePerDay)}
                  <span className="text-xs text-muted-foreground font-normal">
                    /ngày
                  </span>
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 mt-1 border-t border-border/50">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[80px]">
                  {product.location || "Không rõ"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
