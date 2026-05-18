import { useParams, Link } from "wouter";
import {
  MapPin,
  Star,
  Package,
  MessageCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/hooks/use-products";
import { getCategories, CategoryData } from "@/hooks/use-categories";
import { useSellerProfile } from "@/hooks/use-seller-profile";
import { CategoryIcon } from "@/components/category-icon";
import { useState, useEffect } from "react";

export default function Shop() {
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const { data: sellerProfile, isLoading: isLoadingProfile } =
    useSellerProfile(id);

  const { data: productsPage, isLoading } = useProducts();

  const filteredProducts = (productsPage?.items || []).filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    const productSellerId = p.shop?.id;
    const matchesSeller =
      !id || !productSellerId || String(productSellerId) === String(id);
    return matchesCategory && matchesSeller;
  });

  const shopName = sellerProfile?.name || "Cửa hàng";
  const shopAvatar = sellerProfile?.avatar || "/images/placeholder.png";
  const shopCover = sellerProfile?.coverImage || "/images/placeholder.png";
  const shopAddress = sellerProfile?.address || "";
  const shopRating = sellerProfile?.rating ?? 0;
  const shopRatingCount = sellerProfile?.ratingCount ?? 0;
  const shopDescription = sellerProfile?.description || "";
  const shopTotalProducts = sellerProfile?.totalProducts ?? 0;
  const shopTotalOrders = sellerProfile?.totalOrders ?? 0;
  const shopResponseRate = sellerProfile?.responseRate || "--";
  const shopJoinedDate = sellerProfile?.joinedDate || "--";

  return (
    <div className="w-full">
      {/* Shop Banner */}
      <div className="relative h-40 md:h-56 overflow-hidden bg-linear-to-r from-primary/20 to-secondary">
        <img
          src={shopCover}
          alt="Shop banner"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply"
        />
      </div>

      {/* Shop Info */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-3xl border border-border shadow-sm p-6 -mt-8 relative z-10 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg shrink-0">
              <AvatarImage src={shopAvatar} />
              <AvatarFallback className="bg-primary/20 text-primary text-xl">
                {shopName[0] || "S"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold font-display">
                    {shopName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {shopAddress}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {shopRating} ({shopRatingCount} đánh giá)
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    {shopDescription}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Link href="/tin-nhan">
                    <Button variant="outline" className="rounded-full gap-2">
                      <MessageCircle className="h-4 w-4" /> Nhắn tin
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-border/60">
                <div className="text-center">
                  <p className="font-bold text-lg">{shopTotalProducts}</p>
                  <p className="text-xs text-muted-foreground">Sản phẩm</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{shopTotalOrders}</p>
                  <p className="text-xs text-muted-foreground">Đơn hàng</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{shopResponseRate}</p>
                  <p className="text-xs text-muted-foreground">Phản hồi</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm">{shopJoinedDate}</p>
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
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
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
              onClick={() => setSelectedCategory(String(cat.id))}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                selectedCategory === String(cat.id)
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
        {isLoading || isLoadingProfile ? (
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
