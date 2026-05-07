import { useParams, Link } from "wouter";
import {
  MapPin,
  Star,
  Package,
  Clock,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/hooks/use-products";
import { getCategories, CategoryData } from "@/hooks/use-categories";
import { CategoryIcon } from "@/components/category-icon";
import React, { useState, useEffect } from "react";

const MOCK_SHOP = {
  id: "1",
  name: "Shop Đồ Gỗ Thủ Công Hà Nội",
  avatar: "https://i.pravatar.cc/80?img=1",
  coverImage: "https://picsum.photos/seed/shop1/1200/300",
  address: "123 Nguyễn Trãi, Thanh Xuân",
  province: "Hà Nội",
  ward: "Phường Nhân Chính",
  totalOrders: 256,
  totalProducts: 42,
  joinedDate: "03/2022",
  rating: 4.8,
  ratingCount: 189,
  description:
    "Chuyên đồ gỗ thủ công, nội thất vintage chất lượng cao. Cam kết uy tín, hàng đúng mô tả.",
  responseRate: "98%",
  responseTime: "Trong vài phút",
};

export default function Shop() {
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const { data: products, isLoading } = useProducts();

  const filteredProducts = (products || []).filter(
    (p) => selectedCategory === "all" || p.category === selectedCategory,
  );

  return (
    <div className="w-full">
      {/* Shop Banner */}
      <div className="relative h-40 md:h-56 overflow-hidden bg-gradient-to-r from-primary/20 to-secondary">
        <img
          src={MOCK_SHOP.coverImage}
          alt="Shop banner"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply"
        />
      </div>

      {/* Shop Info */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-3xl border border-border shadow-sm p-6 -mt-8 relative z-10 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg flex-shrink-0">
              <AvatarImage src={MOCK_SHOP.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary text-xl">
                {MOCK_SHOP.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold font-display">
                    {MOCK_SHOP.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {MOCK_SHOP.address}, {MOCK_SHOP.province}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {MOCK_SHOP.rating} ({MOCK_SHOP.ratingCount} đánh giá)
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    {MOCK_SHOP.description}
                  </p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <Link href="/tin-nhan">
                    <Button variant="outline" className="rounded-full gap-2">
                      <MessageCircle className="h-4 w-4" /> Nhắn tin
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-border/60">
                <div className="text-center">
                  <p className="font-bold text-lg">{MOCK_SHOP.totalProducts}</p>
                  <p className="text-xs text-muted-foreground">Sản phẩm</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{MOCK_SHOP.totalOrders}</p>
                  <p className="text-xs text-muted-foreground">Đơn hàng</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{MOCK_SHOP.responseRate}</p>
                  <p className="text-xs text-muted-foreground">Phản hồi</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm">{MOCK_SHOP.joinedDate}</p>
                  <p className="text-xs text-muted-foreground">Tham gia</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                selectedCategory === cat.name
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
              }`}
            >
              <CategoryIcon iconName={cat.icon} className="w-4 h-4" />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-3 border border-border"
              >
                <Skeleton className="aspect-square rounded-xl mb-3 w-full" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Chưa có sản phẩm trong danh mục này
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {filteredProducts.slice(0, 16).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
